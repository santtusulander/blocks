import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SubmissionError, formValueSelector } from 'redux-form'
import { Map } from 'immutable'

import { buildReduxId, parseResponseError } from '../../../redux/util'
import accountActions from '../../../redux/modules/entities/accounts/actions'
import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import clusterActions from '../../../redux/modules/entities/CIS-clusters/actions'
import workflowActions from '../../../redux/modules/entities/CIS-workflow-profiles/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import * as uiActions from '../../../redux/modules/ui'

import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getById as getStorageById } from '../../../redux/modules/entities/CIS-ingest-points/selectors'
import { getLocationOptions, getSelectedLocationOptions, getClustersByLocations } from '../../../redux/modules/entities/CIS-clusters/selectors'
import { getABRProfilesOptions } from '../../../redux/modules/entities/CIS-workflow-profiles/selectors'
import { getGlobalFetching } from '../../../redux/modules/fetching/selectors'

import { STORAGE_WORKFLOW_DEFAULT } from '../../../constants/storage'
import { convertToBytes, hasOption } from '../../../util/helpers.js'
import { STORAGE_TRANSCODING_OPTION_ID } from '../../../constants/service-permissions'


import SidePanel from '../../../components/shared/side-panel'
import ModalWindow from '../../../components/shared/modal'
import StorageForm from '../../../components/storage/forms/storage-form'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

class StorageFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteModal: false
    }

    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onToggleDeleteModal = this.onToggleDeleteModal.bind(this)
    this.showNotification= this.showNotification.bind(this)
  }

  componentWillMount() {
    const { accountId, brand, groupId, storageId } = this.props

    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    storageId && this.props.fetchStorage({ brand, account: accountId, group: groupId, id: storageId })
    this.props.fetchClusters({})
    this.props.fetchWorkflows({})
  }

  onToggleDeleteModal(showDeleteModal) {
    this.setState({ showDeleteModal })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.changeNotification, 10000)
  }

  onSave(edit, values) {
    const { brand, accountId, groupId, selectedClusters } = this.props
    const workflow = values.abr ? {
      id: STORAGE_WORKFLOW_DEFAULT,
      profile_id: values.abrProfile
    } : {}

    const data = {
      estimated_usage: Number(convertToBytes(values.estimate, values.estimate_unit)),
      workflow: workflow,
      clusters: selectedClusters
    }

    // Remove workflow property if ABR disabled.
    if (!values.abr) {
      delete data.workflow
    }

    const params = {
      id: values.name,
      brand: brand,
      account: accountId,
      group: groupId,
      payload: data
    }

    const save = edit ? this.props.onUpdate : this.props.onCreate
    const statusMessage = edit
                          ? <FormattedMessage id="portal.storage.storageForm.update.success.status"/>
                          : <FormattedMessage id="portal.storage.storageForm.add.success.status"/>
    return save(params)
      .then(() => {
        this.showNotification(statusMessage)
        this.props.onCancel();
      }).catch(resp => {
        throw new SubmissionError({ _error: parseResponseError(resp) })
      })
  }

  onDelete() {
    const { brand, accountId, groupId, storageId } = this.props

    const params = {
      brand: brand,
      account: accountId,
      group: groupId,
      id: storageId
    }

    return this.props.onDelete(params)
      .then(() => {
        this.showNotification(<FormattedMessage id="portal.storage.storageForm.delete.success.status"/>)
        this.props.onCancel()
      }).catch(resp => {
        throw new SubmissionError({ _error: parseResponseError(resp) })
      })
  }

  render() {
    const { account, abrProfileOptions, group, storageId,
            initialValues, onCancel, abrToggle,
            show, locationOptions, hasTranscodingSupport } = this.props

    const edit = !!initialValues.name

    const title = edit ? <FormattedMessage id="portal.storage.storageForm.edit.title"/>
                       : <FormattedMessage id="portal.storage.storageForm.add.title"/>

    const subTitle = edit ? `${account.get('name')} / ${group.get('name')} / ${storageId}`
                          : `${account.get('name')} / ${group.get('name')}`

    return (
      <div>
        <SidePanel show={show} title={title} subTitle={subTitle} cancel={onCancel}>
          {!this.props.isFetching
           ? <StorageForm
               initialValues={initialValues}
               onSave={(values) => this.onSave(edit, values)}
               onDelete={() => this.onToggleDeleteModal(true)}
               onCancel={onCancel}
               abrToggle={abrToggle}
               hasTranscodingSupport={false}
               locationOptions={locationOptions}
               abrProfileOptions={abrProfileOptions}
             />
           : <LoadingSpinner/>
          }
        </SidePanel>

        {edit && this.state.showDeleteModal &&
          <ModalWindow
            title={<FormattedMessage id="portal.storage.storageForm.deleteModal.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => this.onToggleDeleteModal(false)}
            onSubmit={(storageIdToDelete) => this.onDelete(storageIdToDelete)}>
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
  abrProfileOptions: PropTypes.array,
  abrToggle: PropTypes.bool,
  account: PropTypes.instanceOf(Map),
  accountId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  brand: PropTypes.string,
  changeNotification: PropTypes.func,
  fetchAccount: PropTypes.func,
  fetchClusters: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchStorage: PropTypes.func,
  fetchWorkflows: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  hasTranscodingSupport: PropTypes.bool,
  initialValues: PropTypes.object,
  isFetching: PropTypes.bool,
  locationOptions: PropTypes.array,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  selectedClusters: PropTypes.array,
  show: PropTypes.bool,
  storageId: PropTypes.string
}

StorageFormContainer.defaultProps = {
  account: Map(),
  group: Map()
}

const formSelector = formValueSelector('storageForm')
/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const edit = !!ownProps.storageId
  const isABRSelected = formSelector(state, 'abr')
  const selectedLocations = formSelector(state, 'locations')

  const storageId = ownProps.storageId && buildReduxId(ownProps.groupId, ownProps.storageId)
  const storage = ownProps.storageId && getStorageById(state, storageId)

  const storageWorkflow = storage && storage.get('workflow')
  const clusters = storage && storage.get('clusters')
  const group = ownProps.groupId && getGroupById(state, ownProps.groupId)

  return {
    abrToggle: isABRSelected,
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group,
    isFetching: getGlobalFetching(state),
    locationOptions: getLocationOptions(state),
    abrProfileOptions: getABRProfilesOptions(state),
    selectedClusters: selectedLocations && getClustersByLocations(state, selectedLocations),
    hasTranscodingSupport: hasOption(group, STORAGE_TRANSCODING_OPTION_ID),

    initialValues: {
      name: edit ? ownProps.storageId : '',
      locations: edit && clusters ? getSelectedLocationOptions(state, clusters) : [],
      estimate: edit && storage ? storage.get('estimated_usage') : '',
      abr: edit && storageWorkflow ? true : false,
      abrProfile: edit && storageWorkflow ? storageWorkflow : ''
    }
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch(storageActions.create({...params, data })),
    onUpdate: (params, data) => dispatch(storageActions.update({...params, data })),
    onDelete: (params) => dispatch(storageActions.remove({...params })),
    changeNotification: (message) => dispatch(uiActions.changeNotification(message)),

    fetchAccount: (params) => dispatch(accountActions.fetchOne(params)),
    fetchGroup: (params) => dispatch(groupActions.fetchOne(params)),
    fetchStorage: (params) => dispatch(storageActions.fetchOne(params)),
    fetchClusters: (params) => dispatch(clusterActions.fetchAll(params)),
    fetchWorkflows: (params) => dispatch(workflowActions.fetchAll(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageFormContainer)
