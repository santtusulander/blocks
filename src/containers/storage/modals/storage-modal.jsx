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

/*
  TODO: remove this in scope of
  UDNP-2832 - Integrate CIS Storage configuration form with the redux
*/
const storage_mock = {
  get(cmd) {
    switch (cmd) {
      case 'name':
        return 'Name'
      case 'locations':
        return '1'
      case 'estimate':
        return '10000000000000000'
      case 'abr':
        return true
      case 'abrProfile':
        return 'abr_tv_16_9_high'
    }
  }
}

class StorageFormContainer extends React.Component {
  constructor(props) {
    super(props)

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

  onSave(edit, values) {
    /*
      TODO: fix onSave function in scope of
      UDNP-2832 - Integrate CIS Storage configuration form with the redux

      Don't forget to conver estimated usage value to bytes.
    */

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      payload: {}
    }

    if (edit) params.id = values.name;
    const save = edit ? this.props.onUpdate : this.props.onCreate

    return save(params)
      .then(() => {

        // Close modal
        this.props.onCancel();
      }).catch(resp => {

        throw new SubmissionError({'_error': resp.data.message})

      })
  }

  onDelete(storageId){
    /*
      TODO: fix onDelete function in scope of
      UDNP-2832 - Integrate CIS Storage configuration form with the redux
    */
    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      id: storageId
    }

    return this.props.onDelete(params)
      .then(() => {

        // Close modal
        this.props.onCancel()
      }).catch(resp => {

        throw new SubmissionError({'_error': resp.data.message})

      })
  }

  render() {
    const { account, group, storage, initialValues, onCancel, abrToggle, show } = this.props
    const { showDeleteModal } = this.state
    // simple way to check if editing -> no need to pass 'edit' - prop
    const edit = !!initialValues.name

    const title = edit ? <FormattedMessage id="portal.storage.storageForm.edit.title"/>
                       : <FormattedMessage id="portal.storage.storageForm.add.title"/>

    const subTitle = edit ? `${account.get('name')} / ${group.get('name')} / ${storage.get('name')}`
                          : `${account.get('name')} / ${group.get('name')}`

    return (
      <div>
        <SidePanel show={show} title={title} subTitle={subTitle} cancel={onCancel}>
          <StorageForm
            initialValues={initialValues}
            onSave={(values) => this.onSave(edit, values)}
            onDelete={() => this.onToggleDeleteModal(true)}
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
            onSubmit={(storageId) => this.onDelete(storageId)}>
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
  show: PropTypes.bool,
  storage: PropTypes.instanceOf(Map),
  // eslint-disable-next-line react/no-unused-prop-types
  storageId: PropTypes.string
}

StorageFormContainer.defaultProps = {
  account: Map(),
  group: Map(),
  storage: Map(),
  show: true
}

const formSelector = formValueSelector('storageForm')
const mapStateToProps = (state, ownProps) => {
  const edit = !!ownProps.storageId
  const isABRSelected = formSelector(state, 'abr')
  /*
    TODO: change initialValues to fetch proper data
    UDNP-2832 - Integrate CIS Storage configuration form with the redux
  */
  const storage = storage_mock

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
  /*
    TODO: change networkActions to storageActions in scope of
    UDNP-2832 - Integrate CIS Storage configuration form with the redux
  */
  return {
    onCreate: (params, data) => dispatch( networkActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( networkActions.update( {...params, data } )),
    onDelete: (params) => dispatch( networkActions.remove( {...params } ))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageFormContainer)
