import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormGroup, FormControl, Table, Button } from 'react-bootstrap'
import { Map, List} from 'immutable'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import IconAdd from '../../../components/icons/icon-add'
import TableSorter from '../../../components/table-sorter'
import ActionButtons from '../../../components/action-buttons'
import ModalWindow from '../../../components/modal'
import StorageFormContainer from '../../../containers/storage/modals/storage-modal.jsx'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import * as uiActionCreators from '../../../redux/modules/ui'
import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import clusterActions from '../../../redux/modules/entities/CIS-clusters/actions'
import propertyActions from '../../../redux/modules/entities/properties/actions'
import {fetchMetrics} from '../../../redux/modules/entities/storage-metrics/actions'

import { getSortData, formatBytes } from '../../../util/helpers'
import { getByGroups as getStoragesByGroups } from '../../../redux/modules/entities/CIS-ingest-points/selectors'
import { getAll as getAllClusters } from '../../../redux/modules/entities/CIS-clusters/selectors'
import { getByGroups as getPropetiesByGroups } from '../../../redux/modules/entities/properties/selectors'
import { getByAccountId as getMetricsByAccountId } from '../../../redux/modules/entities/storage-metrics/selectors'
import { getGlobalFetching } from '../../../redux/modules/fetching/selectors'

import { ADD_STORAGE, EDIT_STORAGE, DELETE_STORAGE } from '../../../constants/account-management-modals.js'


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
    this.props.groups.map( group => {
      const account = this.props.account
      const metricsStartDate = new Date()

      this.props.fetchStorages({ group: group.get('id') })
      this.props.fetchProperties({
        brand: account.get('brand_id'),
        account: account.get('id'),
        group: group.get('id')
      })
      this.props.fetchMetrics({
        start: metricsStartDate.getTime(),
        account: account.get('id'),
        group: group.get('id')
      })
    })
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
    return this.props.deleteStorage({group: this.state.storageGroup, id: this.state.storageToDelete})
      .then(() => this.props.toggleModal(null))
  }

  filterData(storageName) {
    return this.props.storages.filter((storage) => {
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
    const { account, group, groups, storages, clusters, properties, metrics,
            accountManagementModal, toggleModal, intl, isFetching } = this.props

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const filteredStorages = this.filterData(this.state.search.toLowerCase())
    const sortedStorages = getSortData(filteredStorages, this.state.sortBy, this.state.sortDir)

    const numHiddenStorages = storages.size - sortedStorages.size
    const storageText = ` ${intl.formatMessage({id: 'portal.account.storages.text'})}`
    const hiddenStorageText = numHiddenStorages ? ` (${numHiddenStorages} ${intl.formatMessage({id: 'portal.account.storages.hidden.text'})})` : ''
    const finalStorageText = sortedStorages.size + storageText + hiddenStorageText

    return (
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
              <Button bsStyle="success" className="btn-icon" onClick={this.addStorage} disabled={!group}>
                <IconAdd />
              </Button>
            </SectionHeader>

            <Table striped={true}>
              <thead>
                <tr>
                  <TableSorter {...sorterProps} column="ingest_point_id">
                    <FormattedMessage id="portal.account.storages.table.name.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="group">
                    <FormattedMessage id="portal.account.storages.table.group.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="originTo">
                    <FormattedMessage id="portal.account.storages.table.originTo.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="location">
                    <FormattedMessage id="portal.account.storages.table.location.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="usage">
                    <FormattedMessage id="portal.account.storages.table.usage.text"/>
                  </TableSorter>
                  <th><FormattedMessage id="portal.account.storages.table.files.text"/></th>
                  <th width="1%"/>
                </tr>
              </thead>
              <tbody>
                {sortedStorages.map((storage, i) => {
                  const storageGroupId = storage.get('parentId')
                  const storageGroup = groups.find(group => (group.get('id') === storageGroupId))
                  const groupName = storageGroup.get('name')
                  const storageId = storage.get('ingest_point_id')

                  let origins = []
                  const storageGatewayHost = storage.getIn(['gateway','hostname'])
                  const originsData = properties.filter(property => {
                    const propertyEdgeConfig = property.getIn(['services', 0, 'configurations', 0, 'edge_configuration'])
                    return propertyEdgeConfig.get('origin_type') === 'cis' &&
                           propertyEdgeConfig.get('origin_host_name') === storageGatewayHost
                  })
                  originsData.forEach(origin => {
                    origins.push(origin.get('published_host_id'))
                  })
                  const originsString = origins.length ? this.formatOrigins(origins) : '-'

                  let locations = []
                  storage.get('clusters').forEach(clusterId => {
                    const clusterData = clusters.find((cluster) => (cluster.get('name') === clusterId))
                    const clusterLocation = clusterData && clusterData.get('description')
                    locations.push(clusterLocation.split(',')[0])
                  })
                  const locationsString = locations.join(', ')
                  const usage = metrics.getIn([0, 'detail', 0, 'bytes'])
                  const fileCount = metrics.getIn([0, 'detail', 0, 'file_count'])

                  return (
                    <tr key={i}>
                      <td>{storageId}</td>
                      <td>{groupName}</td>
                      <td>{originsString}</td>
                      <td>{locationsString}</td>
                      <td>{formatBytes(usage)}</td>
                      <td>{fileCount}</td>
                      <td className="nowrap-column">
                      <ActionButtons onEdit={() => {this.editStorage(storageId, storageGroupId)}}
                                     onDelete={() => {this.toggleDeleteConfirmationModal(storageId, storageGroupId)}} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>

            {accountManagementModal === DELETE_STORAGE &&
             <ModalWindow
               title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: this.state.storageToDelete}}/>}
               content={<FormattedMessage id="portal.account.storages.deleteConfirmation.text"/>}
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
               <FormattedMessage id="portal.account.storages.table.noStoragesFound.text" values={{searchTerm: this.state.search}}/>
             </div>}
          </div>
        }
      </PageContainer>
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
  fetchMetrics: PropTypes.func,
  fetchProperties: PropTypes.func,
  fetchStorages: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List),
  intl: PropTypes.object,
  isFetching: PropTypes.bool,
  metrics: PropTypes.instanceOf(List),
  properties: PropTypes.instanceOf(List),
  storages: PropTypes.instanceOf(List),
  toggleModal: PropTypes.func
}

AccountManagementStorages.defaultProps = {
  storages: List()
}


function mapStateToProps(state) {
  const account = state.account.get('activeAccount')
  const groups = state.group.get('allGroups')
  // TODO Account Id to select metrics mock data
  // Should be removed when metrics API will be ready
  const metricsAccountId = '20005'

  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    account: account,
    groups: groups,
    group: state.group.get('activeGroup'),
    storages: getStoragesByGroups(state, groups),
    clusters: getAllClusters(state),
    properties: getPropetiesByGroups(state, groups),
    metrics: getMetricsByAccountId(state, metricsAccountId),
    isFetching: getGlobalFetching(state)
  }
}

function mapDispatchToProps(dispatch) {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    toggleModal: uiActions.toggleAccountManagementModal,
    deleteStorage: (params) => dispatch( storageActions.remove(params)),
    fetchStorages: (params) => dispatch(storageActions.fetchAll(params)),
    fetchClusters: (params) => dispatch(clusterActions.fetchAll(params)),
    fetchProperties: (params) => dispatch(propertyActions.fetchAll(params)),
    fetchMetrics: (params) => dispatch(fetchMetrics(params))

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountManagementStorages))
