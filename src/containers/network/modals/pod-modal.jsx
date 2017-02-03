import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { formValueSelector, arrayPush } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { bindActionCreators } from 'redux'

import * as uiActionCreators from '../../../redux/modules/ui'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import PodForm from '../../../components/network/forms/pod-form'

//TODO Remove mockInitialValues after Redux integration
const mockInitialValues = {
  get: function(field) {
    switch (field) {
      case 'pod_name':
        return 'pod1'

      case 'lb_method':
        return 1

      case 'pod_type':
        return 2

      case 'localAS':
        return 'AS206810'

      case 'actionItems':
        return [
          {
            actionItemName: 'Item 1',
            removed: false
          }
        ]

      default:
        return null
    }
  }
}
//TODO: remove mockData after integrating with redux
const mockData = {
  get: function(field) {
    switch (field) {
      case 1:
        return ['routingDaemon 1']

      case 2:
        return [
          'footprint 1', 'footprint 2', 'footprint 3'
        ]

      default:
        return null
    }
  }
}

class PodFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.checkforNodes = this.checkforNodes.bind(this)
  }

  onSubmit(values) {
    const { onSave } = this.props
    return onSave(values)
  }

  checkforNodes() {
    //TODO: this should check weather the current POD has Nodes or not
    // and return a boolean
    return true
  }

  render() {
    const {
      account,
      addAvailableAction,
      addNewAction,
      addedActionItems,
      availableActions,
      brand,
      confirmationModalToggled,
      editAction,
      group,
      groupName,
      network,
      pop,
      podId,
      edit,
      initialValues,
      show,
      onCancel,
      onDelete,
      intl,
      discoveryMethodValue,
      invalid,
      toggleDeleteConfirmationModal} = this.props

    const title = edit ? <FormattedMessage id="portal.network.podForm.editPod.title"/> :
      <FormattedMessage id="portal.network.podForm.newPod.title"/>
    const subTitle = `${groupName} / ${network} / ${pop}${edit ? ' / ' + podId : ''}`
    return (
      <div>
        <SidePanel
          className="pod-form-sidebar"
          show={show}
          title={title}
          subTitle={subTitle}
          cancel={onCancel}>
          <PodForm
            addedActionItems={addedActionItems}
            addNewAction={addNewAction}
            addAvailableAction={addAvailableAction}
            availableActions={availableActions}
            edit={edit}
            editAction={editAction}
            initialValues={initialValues}
            intl={intl}
            invalid={invalid}
            hasNodes={this.checkforNodes()}
            onCancel={onCancel}
            onDelete={() => toggleDeleteConfirmationModal(true)}
            onSubmit={this.onSubmit}
            brand={brand}
            account={account}
            pop={pop}
            group={group}
            network={network}
            discoveryMethodValue={discoveryMethodValue}/>
        </SidePanel>

        {edit && confirmationModalToggled &&
          <ModalWindow
            title={<FormattedMessage id="portal.network.podForm.deletePod.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => toggleDeleteConfirmationModal(false)}
            onSubmit={()=>{
              toggleDeleteConfirmationModal(false)
              onDelete()
              onCancel()
            }}>
            <p>
             <FormattedMessage id="portal.network.podForm.deletePod.confirmation.text"/>
            </p>
          </ModalWindow>}

      </div>
    )
  }
}

PodFormContainer.displayName = "PodFormContainer"

PodFormContainer.propTypes = {
  account: PropTypes.string,
  addAvailableAction: PropTypes.func,
  addNewAction: PropTypes.func,
  addedActionItems: PropTypes.array,
  availableActions: PropTypes.array,
  brand: PropTypes.string,
  confirmationModalToggled: PropTypes.bool,
  discoveryMethodValue: PropTypes.number,
  edit: PropTypes.bool,
  editAction: PropTypes.func,
  group: PropTypes.string,
  groupName: PropTypes.string,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  network: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  podId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pop: PropTypes.string,
  show: PropTypes.bool,
  toggleDeleteConfirmationModal: PropTypes.func
}

function mapStateToProps( state, { podId, group }) {
  const selector = formValueSelector('podForm')

  const discoveryMethodValue = selector(state, 'discoveryMethod')
  const addedActionItems = selector(state, 'actionItems')

  const props = {
    discoveryMethodValue,
    addedActionItems,
    availableActions: mockData.get(discoveryMethodValue),
    //TODO: replace .get('allGroups') with .get('activeGroup')
    groupName: state.group
      .get('allGroups')
      .filter((groupElements) => groupElements.get('id') == group)
      .getIn([0, 'name']),
    confirmationModalToggled: state.ui.get('networkDeleteConfirmationModal'),

    initialValues: podId ? {
      pod_name: mockInitialValues.get('pod_name'),
      lb_method: mockInitialValues.get('lb_method'),
      pod_type: mockInitialValues.get('pod_type'),
      localAS: mockInitialValues.get('localAS'),
      actionItems: mockInitialValues.get('actionItems')
    } : {}
  }
  return props
}

const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  return {
    addNewAction: () => {
      //TODO: method called by add button
      dispatch(arrayPush('podForm', 'actionItems', {actionItemName: 'new action', removed: false}))
    },
    addAvailableAction: (value) => {
      if(Array.isArray(value) && value.length) {
        //TODO: Check if the action is already added, don't push an action
        dispatch(arrayPush('podForm', 'actionItems', {actionItemName: value[0], removed: false}))
      }
    },
    editAction: () => {
      //TODO: method invoked by edit button on action
      //it accepts the action id as a parameter
    },
    toggleDeleteConfirmationModal: uiActions.toggleNetworkDeleteConfirmationModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(PodFormContainer)
)
