import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormGroup, FormControl, Table, Button } from 'react-bootstrap'
import { Map, List } from 'immutable'
import moment from 'moment'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import IconAdd from '../../../components/shared/icons/icon-add'
import TableSorter from '../../../components/table-sorter'
import ActionButtons from '../../../components/action-buttons'
import ModalWindow from '../../../components/modal'
import StorageFormContainer from '../../../containers/storage/modals/storage-modal.jsx'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import IsAllowed from '../../../components/is-allowed'

import * as uiActionCreators from '../../../redux/modules/ui'
import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import clusterActions from '../../../redux/modules/entities/CIS-clusters/actions'
import propertyActions from '../../../redux/modules/entities/properties/actions'
import { fetchGroupsMetrics } from '../../../redux/modules/entities/storage-metrics/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'

import { getSortData, formatBytes } from '../../../util/helpers'
import { getByGroups as getStoragesByGroups } from '../../../redux/modules/entities/CIS-ingest-points/selectors'
import { getAll as getAllClusters } from '../../../redux/modules/entities/CIS-clusters/selectors'
import { getByGroups as getPropetiesByGroups } from '../../../redux/modules/entities/properties/selectors'
import { getByGroups as getMetricsByGroups } from '../../../redux/modules/entities/storage-metrics/selectors'
import { getGlobalFetching } from '../../../redux/modules/fetching/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'

import { ADD_STORAGE, EDIT_STORAGE, DELETE_STORAGE } from '../../../constants/account-management-modals.js'
import { STORAGE_METRICS_SHIFT_TIME } from '../../../constants/storage.js'
import * as PERMISSIONS from '../../../constants/permissions.js'


class AccountManagementStorages extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageToDelete: null,
      storageToEdit: null,
      storageGroup: null,
      search: '',
      sortBy: 'ingest_point_id',
      sortDir: 1
    }

    this.changeSearch = this.changeSearch.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.addStorage = this.addStorage.bind(this)
    this.editStorage = this.editStorage.bind(this)
    this.deleteStorage = this.deleteStorage.bind(this)
    this.formatOrigins = this.formatOrigins.bind(this)
  }

  componentWillMount() {
    const {params: {account, brand, group}} = this.props
    const metricsStartDate = moment.utc().subtract(STORAGE_METRICS_SHIFT_TIME, 'hours').unix()

    if (this.props.params.group) {
      this.props.fetchGroup({ brand, account, id: group })
    }

    if (brand && account) {
      this.props.groups.map(group => {
        const groupId = group.get('id')

        this.props.fetchStorages({ brand, account, group: groupId })
        this.props.fetchProperties({ brand, account, group: groupId })

        return false
      })

      this.props.fetchGroupsMetrics(this.props.groups, { start: metricsStartDate, account })
    }

    this.props.fetchClusters({})
  }

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  addStorage() {
    this.props.toggleModal(ADD_STORAGE);
  }

  editStorage(storageId, groupId) {
    this.setState({ storageToEdit: storageId, storageGroup: groupId });
    this.props.toggleModal(EDIT_STORAGE);
  }

  toggleDeleteConfirmationModal(storageId, groupId) {
    this.setState({ storageToDelete: storageId, storageGroup: groupId  });
    this.props.toggleModal(DELETE_STORAGE);
  }

  deleteStorage() {
    return this.props.deleteStorage({
      brand: this.props.account.get('brand_id'),
      account: this.props.account.get('id'),
      group: this.state.storageGroup,
      id: this.state.storageToDelete
    }).then(() => {
      this.props.showNotification(<FormattedMessage id="portal.storage.storageForm.delete.success.status"/>)
      this.props.toggleModal(null)
    }).catch (() => {
      this.props.showNotification(<FormattedMessage id="portal.storage.storageForm.delete.failed.status"/>)
    })
  }

  filterData(storages, storageName) {
    return storages.filter((storage) => {
      return storage.get('ingest_point_id').toLowerCase().includes(storageName)
    })
  }

  formatOrigins(origins) {
    if (origins.length === 1) {
      return origins[0]
    } else {
      return <FormattedMessage id="portal.common.andMore" values={{firstItem: origins[0], count: origins.length-1}} />
    }
  }

  render() {
    const { account, group, groups, storages, clusters, properties, metrics, params,
            accountManagementModal, toggleModal, intl, isFetching } = this.props

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const storagesFullData = storages.map(storage => {
      const storageGroupId = storage.get('parentId')
      // eslint-disable-next-line eqeqeq
      const storageGroup = groups.find(group => (group.get('id') == storageGroupId))
      const groupName = storageGroup && storageGroup.get('name')

      const origins = []
      const storageGatewayHost = storage.getIn(['gateway','hostname'])
      const originsData = properties.filter(property => {
        const propertyEdgeConfig = property.getIn(['services', 0, 'configurations', 0, 'edge_configuration'])
        return propertyEdgeConfig.get('origin_type') === 'cis' &&
               propertyEdgeConfig.get('origin_host_name') === storageGatewayHost
      })
      originsData.forEach(origin => {
        origins.push(origin.get('published_host_id'))
      })

      const locations = []
      storage.get('clusters').forEach(clusterId => {
        const clusterData = clusters.find((cluster) => (cluster.get('name') === clusterId))
        if (clusterData) {
          const clusterLocation = clusterData && clusterData.get('description').split(',')
          locations.push(clusterLocation[0])
        }
      })
      const locationsString = locations.join(', ')
      const storageMetrics = metrics && metrics.find(metric => (metric.get('ingest_point') === storage.get('ingest_point_id')))
      const usage = storageMetrics && storageMetrics.getIn(['totals', 'bytes', 'ending'])
      const filesCount = storageMetrics && storageMetrics.getIn(['totals', 'files_count', 'ending'])

      return storage.setIn(['group_name'], groupName)
                    .setIn(['origins'], origins)
                    .setIn(['locations'], locationsString)
                    .setIn(['usage'], usage || 0)
                    .setIn(['files_count'], filesCount || 0)
    })

    const filteredStorages = this.filterData(storagesFullData, this.state.search.toLowerCase())
    const sortedStorages = getSortData(filteredStorages, this.state.sortBy, this.state.sortDir)

    const numHiddenStorages = storagesFullData.size - sortedStorages.size
    const storageText = ` ${intl.formatMessage({id: 'portal.account.storage.text'})}`
    const hiddenStorageText = numHiddenStorages ? ` (${numHiddenStorages} ${intl.formatMessage({id: 'portal.account.storage.hidden.text'})})` : ''
    const finalStorageText = sortedStorages.size + storageText + hiddenStorageText

    const permissions = {modify: PERMISSIONS.MODIFY_STORAGE , delete: PERMISSIONS.DELETE_STORAGE}

    return (
      <IsAllowed to={PERMISSIONS.LIST_STORAGE}>
        <PageContainer className="account-management-storages">
          { isFetching ? <LoadingSpinner/> :
            <div>
              <SectionHeader sectionHeaderTitle={finalStorageText}>
                <FormGroup className="search-input-group">
                  <FormControl
                    type="text"
                    className="search-input"
                    placeholder={intl.formatMessage({id: 'portal.common.search.text'})}
                    value={this.state.search}
                    onChange={this.changeSearch}  />
                </FormGroup>
                <Button bsStyle="success" className="btn-icon" onClick={this.addStorage} disabled={!params.group}>
                  <IconAdd />
                </Button>
              </SectionHeader>

              <Table striped={true}>
                <thead>
                  <tr>
                    <TableSorter {...sorterProps} column="ingest_point_id">
                      <FormattedMessage id="portal.account.storage.table.name.text"/>
                    </TableSorter>
                    <TableSorter {...sorterProps} column="group_name">
                      <FormattedMessage id="portal.account.storage.table.group.text"/>
                    </TableSorter>
                    <TableSorter {...sorterProps} column="origins">
                      <FormattedMessage id="portal.account.storage.table.originTo.text"/>
                    </TableSorter>
                    <TableSorter {...sorterProps} column="locations">
                      <FormattedMessage id="portal.account.storage.table.location.text"/>
                    </TableSorter>
                    <TableSorter {...sorterProps} column="usage">
                      <FormattedMessage id="portal.account.storage.table.usage.text"/>
                    </TableSorter>
                    <th><FormattedMessage id="portal.account.storage.table.files.text"/></th>
                    <th width="1%"/>
                  </tr>
                </thead>
                <tbody>
                  {sortedStorages.map((storage, i) => {
                    const storageId = storage.get('ingest_point_id')
                    const origins = storage.get('origins')
                    const originsString = origins.length ? this.formatOrigins(origins) : '-'

                    return (
                      <tr key={i}>
                        <td>{storageId}</td>
                        <td>{storage.get('group_name')}</td>
                        <td>{originsString}</td>
                        <td>{storage.get('locations')}</td>
                        <td>{formatBytes(storage.get('usage'))}</td>
                        <td>{storage.get('files_count')}</td>
                        <td className="nowrap-column">

                        {/*TODO: add edit to ActionButtons once API from CIS-322 is ready
                            onEdit={(() => {this.editStorage(storageId, storage.get('parentId'))})}
                        */}
                        <ActionButtons
                          permissions={permissions}
                          onDelete={() => {
                            this.toggleDeleteConfirmationModal(storageId, storage.get('parentId'))
                          }} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>

              {accountManagementModal === DELETE_STORAGE &&
               <ModalWindow
                 title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: this.state.storageToDelete}}/>}
                 content={<FormattedMessage id="portal.account.storage.deleteConfirmation.text"/>}
                 verifyDelete={true}
                 deleteButton={true}
                 cancelButton={true}
                 cancel={() => toggleModal(null)}
                 onSubmit={() => this.deleteStorage()} />}

              {((accountManagementModal === ADD_STORAGE) || (accountManagementModal === EDIT_STORAGE)) &&
                <StorageFormContainer
                  show={true}
                  brand={account.get('brand_id')}
                  accountId={account.get('id')}
                  storageId={(accountManagementModal === EDIT_STORAGE) ? this.state.storageToEdit : ''}
                  groupId={(accountManagementModal === EDIT_STORAGE) ? this.state.storageGroup : group.get('id')}
                  fetching={false}
                  onCancel={() => this.props.toggleModal()}
                />
              }

              {sortedStorages.size === 0 && this.state.search.length > 0 &&
               <div className="text-center">
                 <FormattedMessage id="portal.account.storage.table.noStoragesFound.text" values={{searchTerm: this.state.search}}/>
               </div>}
            </div>
          }
        </PageContainer>
      </IsAllowed>
    )
  }
}

AccountManagementStorages.displayName = 'AccountManagementStorages'
AccountManagementStorages.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountManagementModal: PropTypes.string,
  clusters: PropTypes.instanceOf(List),
  deleteStorage: PropTypes.func,
  fetchClusters: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchGroupsMetrics: PropTypes.func,
  fetchProperties: PropTypes.func,
  fetchStorages: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List),
  intl: PropTypes.object,
  isFetching: PropTypes.bool,
  metrics: PropTypes.instanceOf(List),
  params: PropTypes.object,
  properties: PropTypes.instanceOf(List),
  showNotification: PropTypes.func,
  storages: PropTypes.instanceOf(List),
  toggleModal: PropTypes.func
}

AccountManagementStorages.defaultProps = {
  storages: List()
}


function mapStateToProps(state, ownProps) {
  const account = state.account.get('activeAccount')
  const groups = state.group.get('allGroups')

  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    account: account,
    groups: groups,
    group: getGroupById(state, ownProps.params.group),
    storages: getStoragesByGroups(state, groups),
    clusters: getAllClusters(state),
    properties: getPropetiesByGroups(state, groups),
    metrics: getMetricsByGroups(state),
    isFetching: getGlobalFetching(state)
  }
}

function mapDispatchToProps(dispatch) {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    toggleModal: uiActions.toggleAccountManagementModal,
    deleteStorage: (params) => dispatch(storageActions.remove(params)),
    fetchStorages: (params) => dispatch(storageActions.fetchAll(params)),
    fetchClusters: (params) => dispatch(clusterActions.fetchAll(params)),
    fetchProperties: (params) => dispatch(propertyActions.fetchAll(params)),
    fetchGroupsMetrics: (groups, params) => dispatch(fetchGroupsMetrics(groups, params)),
    fetchGroup: (params) => dispatch(groupActions.fetchOne(params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountManagementStorages))
