import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SubmissionError, formValueSelector } from 'redux-form'
import { Map } from 'immutable'

import networkActions from '../../../redux/modules/entities/networks/actions'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import StorageForm from '../../../components/storage/forms/storage-form'
import '../../../components/account-management/group-form.scss'

class StorageFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.storageId = null
    this.state = {
      showDeleteModal : false
    }

    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onToggleDeleteModal = this.onToggleDeleteModal.bind(this)
  }

  onToggleDeleteModal(showDeleteModal) {
    this.setState({ showDeleteModal })
  }

  onDelete(storageId) {
    this.storageId = storageId
    this.onToggleDeleteModal(true)
  }

  onSave(edit, values) {

    const data = {
      description: values.description
    }

    // add id if create new
    if (!edit) {
      data.id = values.name
    }

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      payload: data
    }

    if (edit) params.id = values.name;
    const save = edit ? this.props.onUpdate : this.props.onCreate

    return save(params)
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        // Close modal
        this.props.onCancel();
      })
  }

  /**
   * Handler for Delete
   */
  onDelete(){
    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      id: this.storageId
    }

    return this.props.onDelete(params)
      .then((resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        // Close modal
        this.props.onCancel()
      })
  }

  render() {
    const { account, group, storage, initialValues, onCancel, abrToggle } = this.props
    const { showDeleteModal } = this.state
    // simple way to check if editing -> no need to pass 'edit' - prop
    const edit = !!initialValues.name

    const title = edit ? <FormattedMessage id="portal.storage.storageForm.edit.title"/>
                       : <FormattedMessage id="portal.storage.storageForm.add.title"/>

    const subTitle = edit ? `${account.get('name')} / ${group.get('name')} / ${storage.get('name')}`
                          : `${account.get('name')} / ${group.get('name')}`

    return (
      <div>
        <SidePanel show={true} title={title} subTitle={subTitle} cancel={onCancel}>
          <StorageForm
            initialValues={initialValues}
            onSave={(values) => this.onSave(edit, values)}
            onDelete={this.onDelete}
            onCancel={onCancel}
            abrToggle={abrToggle}
          />
        </SidePanel>

        {edit && showDeleteModal &&
          <ModalWindow
            title={<FormattedMessage id="portal.storage.storageForm.deleteModal.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => this.onToggleDeleteModal(false)}
            onSubmit={() => this.onDelete()}>
            <p>
             <FormattedMessage id="portal.storage.storageForm.deleteModal.confirmation.text"/>
            </p>
          </ModalWindow>}
      </div>
    )
  }
}

StorageFormContainer.displayName = "StorageFormContainer"
StorageFormContainer.propTypes = {
  abrToggle: PropTypes.bool,
  account: PropTypes.instanceOf(Map),
  accountId: PropTypes.string,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.string,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  storage: PropTypes.instanceOf(Map)
}

StorageFormContainer.defaultProps = {
  account: Map(),
  group: Map(),
  storage: Map()
}

const formSelector = formValueSelector('storageForm')
const mapStateToProps = (state, ownProps) => {
  const edit = !!ownProps.storageId
  const isABRSelected = formSelector(state, 'abr')
  const storage = ''

  return {
    abrToggle: isABRSelected,
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    initialValues: {
      name: edit && storage ? storage.get('name') : '',
      locations: edit && storage ? storage.get('locations') : '',
      estimate: edit && storage ? storage.get('estimate') : '',
      abr: edit && storage ? storage.get('abr') : '',
      abrProfile: edit && storage ? storage.get('abrProfile') : ''
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( networkActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( networkActions.update( {...params, data } )),
    onDelete: (params) => dispatch( networkActions.remove( {...params } ))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageFormContainer)
