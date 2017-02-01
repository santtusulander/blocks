import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import SidePanel from '../../../components/side-panel'

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
            actionItemElement: 'Item 1',
            removed: false
          },
          {
            actionItemElement: 'Item 2',
            removed: false
          },
          {
            actionItemElement: 'Item 3',
            removed: false
          },
          {
            actionItemElement: 'Item 4',
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
        return [
          'routingDaemon 1', 'routingDaemon 2', 'routingDaemon 3'
        ]

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
      addAction,
      availableActions,
      brand,
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
      searchInputValue,
      invalid} = this.props

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
            addAction={addAction}
            availableActions={availableActions}
            edit={edit}
            editAction={editAction}
            initialValues={initialValues}
            intl={intl}
            invalid={invalid}
            hasNodes={this.checkforNodes()}
            onCancel={onCancel}
            onDelete={onDelete}
            onSubmit={this.onSubmit}
            brand={brand}
            account={account}
            pop={pop}
            group={group}
            network={network}
            discoveryMethodValue={discoveryMethodValue}
            searchInputValue={searchInputValue}/>
        </SidePanel>
      </div>
    )
  }
}

PodFormContainer.displayName = "PodFormContainer"

PodFormContainer.propTypes = {
  account: PropTypes.string,
  addAction: PropTypes.func,
  brand: PropTypes.string,
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
  show: PropTypes.bool
}

function mapStateToProps( state, { podId, group }) {
  const selector = formValueSelector('podForm')

  const discoveryMethodValue = selector(state, 'discoveryMethod')
  const searchInputValue = selector(state, 'searchInput')

  const props = {
    discoveryMethodValue,
    searchInputValue,
    availableActions: mockData.get(discoveryMethodValue),
    //TODO: replace .get('allGroups') with .get('activeGroup')
    groupName: state.group
      .get('allGroups')
      .filter((groupElements) => groupElements.get('id') == group)
      .getIn([0, 'name']),
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

const mapDispatchToProps = () => {
  return {
    addAction: () => {
      //TODO: method called by add button
    },
    editAction: () => {
      //TODO: method invoked by edit button on action
      //it accepts the action id as a parameter
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(PodFormContainer)
)
