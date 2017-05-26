import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormGroup, FormControl, Table, Button } from 'react-bootstrap'
import { Map, List } from 'immutable'
import moment from 'moment'

import PageContainer from '../../../components/shared/layout/page-container'
import SectionHeader from '../../../components/shared/layout/section-header'
import IconAdd from '../../../components/shared/icons/icon-add'
import TableSorter from '../../../components/shared/table-sorter'
import ActionButtons from '../../../components/shared/action-buttons'
import ModalWindow from '../../../components/shared/modal'
import StorageFormContainer from '../../../containers/storage/modals/storage-modal.jsx'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import IsAllowed from '../../../components/shared/permission-wrappers/is-allowed'

import * as uiActionCreators from '../../../redux/modules/ui'
import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import clusterActions from '../../../redux/modules/entities/CIS-clusters/actions'
import propertyActions from '../../../redux/modules/entities/properties/actions'
import { fetchGroupMetrics } from '../../../redux/modules/entities/storage-metrics/actions'

import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'

import { getSortData, formatBytes, hasService } from '../../../util/helpers'
import { getByGroup as getStoragesByGroup } from '../../../redux/modules/entities/CIS-ingest-points/selectors'
import { getAll as getAllClusters } from '../../../redux/modules/entities/CIS-clusters/selectors'
import { getByGroup as getPropetiesByGroup } from '../../../redux/modules/entities/properties/selectors'
import { getByGroup as getMetricsByGroup } from '../../../redux/modules/entities/storage-metrics/selectors'
import { getGlobalFetching } from '../../../redux/modules/fetching/selectors'

import { ADD_STORAGE, EDIT_STORAGE, DELETE_STORAGE } from '../../../constants/account-management-modals.js'
import { STORAGE_SERVICE_ID } from '../../../constants/service-permissions'
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
    this.fetchStorageData = this.fetchStorageData.bind(this)
  }

  componentWillMount() {
    const {params: {account, brand, group}} = this.props

    if (brand && account && group) {
      this.fetchStorageData(group)
    }

    this.props.fetchClusters({})
  }

  componentWillReceiveProps(nextProps) {
    //Start fetching storage data when changing active group
    if (this.props.params.group !== nextProps.params.group) {
      //Fetch storage data for storages in newly selected group
      this.fetchStorageData(nextProps.params.group)
    }
  }

  fetchStorageData(groupId) {
    const { params: { brand, account }, fetchStorages, fetchProperties } = this.props
    const metricsStartDate = moment.utc().subtract(STORAGE_METRICS_SHIFT_TIME, 'hours').unix()
    if (brand && account && groupId) {
      fetchStorages({ brand, account, group: groupId, format: 'full'})
      fetchProperties({ brand, account, group: groupId})
      this.props.fetchGroupMetrics(groupId, { start: metricsStartDate, account })
    }
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
    const { account, group, storages, clusters, properties, metrics, params,
            accountManagementModal, toggleModal, intl, isFetching } = this.props

    const hasStorageService = hasService(group, STORAGE_SERVICE_ID)
    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const storagesFullData = storages.map(storage => {
      const storageGroup = group
      const groupName = storageGroup && storageGroup.get('name')
      const origins = []
      const storageOriginHostName = storage.getIn(['origin','hostname'])
      const originsData = properties.filter(property => {
        const propertyEdgeConfig = property.getIn(['services', 0, 'configurations', 0, 'edge_configuration'])
        return propertyEdgeConfig.get('origin_type') === 'cis' &&
               propertyEdgeConfig.get('origin_host_name') === storageOriginHostName
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

    if (!params.group) {
      return (
        <PageContainer className="account-management-storages">
          <p className="text-center">
            <FormattedMessage id="portal.account.storage.groupNotSelected.text" values={{br: <br/>}}/>
          </p>
        </PageContainer>
      )
    }

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
                {hasStorageService &&
                  <IsAllowed to={PERMISSIONS.CREATE_STORAGE}>
                    <Button bsStyle="success" className="btn-icon" onClick={this.addStorage}>
                      <IconAdd />
                    </Button>
                  </IsAllowed>}
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
                    {hasStorageService &&
                      <IsAllowed to={PERMISSIONS.DELETE_STORAGE || PERMISSIONS.MODIFY_STORAGE}>
                        <th width="1%"/>
                      </IsAllowed>
                    }
                  </tr>
                </thead>
                <tbody>
                  {!sortedStorages.size && !this.state.search.length &&
                    <tr>
                      <td colSpan="7">
                        <FormattedMessage id="portal.account.storage.table.noStorages.text" />
                      </td>
                    </tr>}

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
                        {hasStorageService &&
                          <IsAllowed to={PERMISSIONS.DELETE_STORAGE || PERMISSIONS.MODIFY_STORAGE}>
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
                          </IsAllowed>
                        }
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
                  groupId={(accountManagementModal === EDIT_STORAGE) ? this.state.storageGroup : params.group}
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
  fetchGroupMetrics: PropTypes.func,
  fetchProperties: PropTypes.func,
  fetchStorages: PropTypes.func,
  group: PropTypes.instanceOf(Map),
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
  account: Map(),
  group: Map(),
  storages: List()
}

/* istanbul ignore next */
function mapStateToProps(state, ownProps) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    account: getAccountById(state, ownProps.params.account),
    group: getGroupById(state, ownProps.params.group),
    storages: getStoragesByGroup(state, ownProps.params.group),
    clusters: getAllClusters(state),
    properties: getPropetiesByGroup(state, ownProps.params.group),
    metrics: getMetricsByGroup(state),
    isFetching: getGlobalFetching(state)
  }
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    toggleModal: uiActions.toggleAccountManagementModal,
    deleteStorage: (params) => dispatch(storageActions.remove(params)),
    fetchStorages: (params) => dispatch(storageActions.fetchAll(params)),
    fetchClusters: (params) => dispatch(clusterActions.fetchAll(params)),
    fetchProperties: (params) => dispatch(propertyActions.fetchAll(params)),
    fetchGroupMetrics: (group, params) => dispatch(fetchGroupMetrics(group, params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountManagementStorages))
