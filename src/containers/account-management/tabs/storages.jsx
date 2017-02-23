import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormGroup, FormControl, Table, Button } from 'react-bootstrap'
import {fromJS, List} from 'immutable'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import IconAdd from '../../../components/icons/icon-add'
import TableSorter from '../../../components/table-sorter'
import ActionButtons from '../../../components/action-buttons'
import ModalWindow from '../../../components/modal'

import * as uiActionCreators from '../../../redux/modules/ui'

import { getSortData } from '../../../util/helpers'

import { ADD_STORAGE, EDIT_STORAGE, DELETE_STORAGE } from '../../../constants/account-management-modals.js'

// TODO Remove this in scope of UDNP-2849 when redux will be ready
const mockRedux = {
  get: function(entity) {
    switch (entity) {
      case 'storages':
        return fromJS([{
          id: 1,
          name: 'Media Storage',
          group: 'Group A',
          originTo: 'mysite.com',
          location: 'Frankfurt',
          usage: '450 GB',
          files: 1404
        },{
          id: 2,
          name: 'Bangkok Storage',
          group: 'Group B',
          originTo: 'foobar.com and 1 more',
          location: 'San Jose',
          usage: '1.2 TB',
          files: 28776
        },{
          id: 3,
          name: 'Asia Storage',
          group: 'Group C',
          originTo: 'barfoo.com',
          location: 'Hong Kong',
          usage: '900 GB',
          files: 1404
        },{
          id: 4,
          name: 'Dataphone Storage',
          group: 'Group D',
          originTo: 'mysite.com and 5 more',
          location: 'San Jose, 2 copies',
          usage: '2.3 TB',
          files: 1404
        }])

      default:
        return null
    }
  }
}

class AccountManagementStorages extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageToDelete: null,
      storageToEdit: null,
      search: '',
      sortBy: 'name',
      sortDir: 1
    }

    this.changeSearch = this.changeSearch.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.addStorage = this.addStorage.bind(this)
    this.editStorage = this.editStorage.bind(this)
    this.deleteStorage = this.deleteStorage.bind(this)
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

  filterData( storageName ) {
    return this.props.storages.filter((storage) => {
      return storage.get('name').toLowerCase().includes(storageName)
    })
  }

  render() {
    const { storages, accountManagementModal, toggleModal, intl } = this.props

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const filteredStorages = this.filterData(this.state.search.toLowerCase())
    const sortedStorages = getSortData(filteredStorages, this.state.sortBy, this.state.sortDir)

    const numHiddenStorages = storages.size - sortedStorages.size
    const storageText = (sortedStorages.size === 1) ? ` ${intl.formatMessage({id: 'portal.account.storages.single.text'})}` :
                                                      ` ${intl.formatMessage({id: 'portal.account.storages.multiple.text'})}`
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
              <TableSorter {...sorterProps} column="name">
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
              return (
                <tr key={i}>
                  <td>{storage.get('name')}</td>
                  <td>{storage.get('group')}</td>
                  <td>{storage.get('originTo')}</td>
                  <td>{storage.get('location')}</td>
                  <td>{storage.get('usage')}</td>
                  <td>{storage.get('files')}</td>
                  <td className="nowrap-column">
                  <ActionButtons onEdit={() => {this.editStorage(storage)}} onDelete={() => {this.toggleDeleteConfirmationModal(storage)}} />
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
  intl: PropTypes.object,
  storages: PropTypes.instanceOf(List),
  toggleModal: PropTypes.func
}

AccountManagementStorages.defaultProps = {
  storages: List()
}


function mapStateToProps(state) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    storages: mockRedux.get('storages')
  }
}

function mapDispatchToProps(dispatch) {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    toggleModal: uiActions.toggleAccountManagementModal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountManagementStorages))
