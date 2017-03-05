import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormGroup, FormControl, Table, Button } from 'react-bootstrap'
import { List} from 'immutable'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import IconAdd from '../../../components/icons/icon-add'
import TableSorter from '../../../components/table-sorter'
import ActionButtons from '../../../components/action-buttons'
import ModalWindow from '../../../components/modal'

import * as uiActionCreators from '../../../redux/modules/ui'
import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import clusterActions from '../../../redux/modules/entities/CIS-clusters/actions'

import { getSortData, formatBytes } from '../../../util/helpers'
import { getByGroups as getStoragesByGroups } from '../../../redux/modules/entities/CIS-ingest-points/selectors'
import { getAll as getAllClusters } from '../../../redux/modules/entities/CIS-clusters/selectors'

import { ADD_STORAGE, EDIT_STORAGE, DELETE_STORAGE } from '../../../constants/account-management-modals.js'
import StorageFormContainer from '../../../containers/storage/modals/storage-modal.jsx'


class AccountManagementStorages extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageToDelete: null,
      storageToEdit: null,
      search: '',
      sortBy: 'id',
      sortDir: 1
    }

    this.changeSearch = this.changeSearch.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.addStorage = this.addStorage.bind(this)
    this.editStorage = this.editStorage.bind(this)
    this.deleteStorage = this.deleteStorage.bind(this)
    this.formatLocations = this.formatLocations.bind(this)
  }

  componentWillMount() {
    this.props.groups.map( group => {
      this.props.fetchStorages({group: group.get('id') })
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

  // TODO Integrate storage add/edit/delete functionality in scope of UDNP-2849 when forms and redux will be ready
  addStorage() {
    this.props.toggleModal(ADD_STORAGE);
  }

  editStorage(storage) {
    this.setState({ storageToEdit: storage });
    this.props.toggleModal(EDIT_STORAGE);
  }

  toggleDeleteConfirmationModal(storage) {
    this.setState({ storageToDelete: storage });
    this.props.toggleModal(DELETE_STORAGE);
  }

  deleteStorage() {
    // return this.props.storageActions.deleteStorage(this.storageToDelete)
    //   .then(() => this.props.toggleModal(null))
  }

  filterData(storageName) {
    return this.props.storages.filter((storage) => {
      return storage.get('id').toLowerCase().includes(storageName)
    })
  }

  formatLocations(locations) {
    if (locations.length === 1) {
      return locations[0]
    } else {
      return <FormattedMessage id="portal.common.andMore" values={{firstItem: locations[0], count: locations.length-1}} />
    }
  }

  render() {
    const {groups, storages, clusters, accountManagementModal, toggleModal, intl } = this.props

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
        <SectionHeader sectionHeaderTitle={finalStorageText}>
          <FormGroup className="search-input-group">
            <FormControl
              type="text"
              className="search-input"
              placeholder={intl.formatMessage({id: 'portal.common.search.text'})}
              value={this.state.search}
              onChange={this.changeSearch}  />
          </FormGroup>
          <Button bsStyle="success" className="btn-icon" onClick={this.addStorage}>
            <IconAdd />
          </Button>
        </SectionHeader>

        <Table striped={true}>
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="id">
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
              const groupName = groups.find((group) => (group.get('id') === storageGroupId)).get('name')

              let locations = []
              storage.get('clusters').forEach(clusterId => {
                const clusterData = clusters.find((cluster) => (cluster.get('name') === clusterId))
                const clusterLocation = clusterData && clusterData.get('description')
                locations.push(clusterLocation)
              })

              return (
                <tr key={i}>
                  <td>{storage.get('id')}</td>
                  <td>{groupName}</td>
                  <td>{storage.get('originTo')}</td>
                  <td>{locations.length && this.formatLocations(locations)}</td>
                  <td>{formatBytes(storage.get('usage'))}</td>
                  <td>{storage.get('files')}</td>
                  <td className="nowrap-column">
                  <ActionButtons onEdit={() => {this.editStorage(storage.get('id'))}} onDelete={() => {this.toggleDeleteConfirmationModal(storage)}} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        {accountManagementModal === DELETE_STORAGE &&
         <ModalWindow
           title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: this.state.storageToDelete.get('name')}}/>}
           content={<FormattedMessage id="portal.account.storages.deleteConfirmation.text"/>}
           verifyDelete={true}
           deleteButton={true}
           cancelButton={true}
           cancel={() => toggleModal(null)}
           onSubmit={() => this.deleteStorage()} />}

        {/* TODO: UDNP-2849: Integrate List Storage Items in storage tab with redux and create/edit/delete forms */}
        {((accountManagementModal === ADD_STORAGE) || (accountManagementModal === EDIT_STORAGE)) &&
          <StorageFormContainer
            show={true}
            brand={"udn"}
            accountId={"238"}
            storageId={(accountManagementModal === EDIT_STORAGE) ? "storage1" : ''}
            groupId={"339"}
            fetching={false}
            onCancel={() => this.props.toggleModal()}
            onSubmit={() => {/* noop */}}
          />
        }

        {sortedStorages.size === 0 && this.state.search.length > 0 &&
         <div className="text-center">
           <FormattedMessage id="portal.account.storages.table.noStoragesFound.text" values={{searchTerm: this.state.search}}/>
         </div>}
      </PageContainer>
    )
  }
}

AccountManagementStorages.displayName = 'AccountManagementStorages'
AccountManagementStorages.propTypes = {
  accountManagementModal: PropTypes.string,
  clusters: PropTypes.instanceOf(List),
  fetchClusters: PropTypes.func,
  fetchStorages: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  intl: PropTypes.object,
  storages: PropTypes.instanceOf(List),
  toggleModal: PropTypes.func
}

AccountManagementStorages.defaultProps = {
  storages: List()
}


function mapStateToProps(state) {
  const account = state.account.get('activeAccount')
  const groups = state.group.get('allGroups')
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    activeAccount: account,
    groups: groups,
    storages: getStoragesByGroups(state, groups),
    clusters: getAllClusters(state)
  }
}

function mapDispatchToProps(dispatch) {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    toggleModal: uiActions.toggleAccountManagementModal,
    fetchStorages: (params) => dispatch(storageActions.fetchAll(params)),
    fetchClusters: (params) => dispatch(clusterActions.fetchAll(params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountManagementStorages))
