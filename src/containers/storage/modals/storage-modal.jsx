import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SubmissionError, formValueSelector } from 'redux-form'
import { Map } from 'immutable'

import { buildReduxId } from '../../../redux/util'
import accountActions from '../../../redux/modules/entities/accounts/actions'
import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import clusterActions from '../../../redux/modules/entities/CIS-clusters/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'

import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getById as getStorageById } from '../../../redux/modules/entities/CIS-ingest-points/selectors'
import { getLocationOptions, getSelectedLocationOptions } from '../../../redux/modules/entities/CIS-clusters/selectors'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import StorageForm from '../../../components/storage/forms/storage-form'

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

  componentWillMount() {
    const { accountId, brand, groupId, storageId } = this.props

    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    if (storageId) {
      this.props.fetchStorage({ group: groupId, id: storageId })
      this.props.fetchClusters({})
    }
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
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        // Close modal
        this.props.onCancel();
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
    const { account, group, storage, initialValues, onCancel, abrToggle, show, locationOptions } = this.props
    const { showDeleteModal } = this.state

    const edit = !!initialValues.name

    const title = edit ? <FormattedMessage id="portal.storage.storageForm.edit.title"/>
                       : <FormattedMessage id="portal.storage.storageForm.add.title"/>

    const subTitle = edit ? `${account.get('name')} / ${group.get('name')} / ${storage.get('id')}`
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
            locationOptions={locationOptions}
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
  brand: PropTypes.string,
  fetchAccount: PropTypes.func,
  fetchClusters: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchStorage: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.string,
  initialValues: PropTypes.object,
  locationOptions: PropTypes.array,
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

  const storageId = ownProps.storageId && buildReduxId(ownProps.groupId, ownProps.storageId)
  const storage = ownProps.storageId && getStorageById(state, storageId)

  const storageWorkflow = storage && storage.get('workflow')
  const clusters = storage && storage.get('clusters')

  return {
    abrToggle: isABRSelected,
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    storage: storage,
    locationOptions: getLocationOptions(state),

    initialValues: {
      name: edit ? ownProps.storageId : '',
      locations: edit && clusters ? getSelectedLocationOptions(state, clusters) : [],
      estimate: edit && storage ? storage.get('estimated_usage') : '',
      abr: edit && storageWorkflow ? true : false,
      abrProfile: edit && storageWorkflow ? storageWorkflow : ''
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( storageActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( storageActions.update( {...params, data } )),
    onDelete: (params) => dispatch( storageActions.remove( {...params } )),

    fetchAccount: (params) => dispatch( accountActions.fetchOne(params) ),
    fetchGroup: (params) => dispatch( groupActions.fetchOne(params) ),
    fetchStorage: (params) => dispatch( storageActions.fetchOne(params) ),
    fetchClusters: (params) => dispatch( clusterActions.fetchAll(params) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageFormContainer)
