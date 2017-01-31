import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FieldArray } from 'redux-form'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import IconAdd from '../icons/icon-add.jsx'
import ActionItemMembers from './action-item-members'

import { DISCOVERY_METHOD_TYPE } from '../../constants/network'

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


class ActionItem extends Component {
  render() {
    const { addAction, availableMembers, editAction, intl, type } = this.props
    const label = DISCOVERY_METHOD_TYPE
      .filter(elm => elm.get('key') === type)
      .getIn([0, 'label'])

    return (
      type ? <div className="action-item">
        <div className="action-item-header">
          <h3 className="action-item-title">
            <FormattedMessage
              id="portal.network.podForm.actionItem.add.label"
              values={{label: label}} />
          </h3>
          <Button bsStyle="primary" className="btn-icon btn-success pull-right"
            onClick={addAction}
            disabled={false}>
            <IconAdd />
          </Button>
        </div>

        <div className="conditions">
          <FieldArray
            intl={intl}
            name="members"
            props={{
              availableMembers:availableMembers,
              label: label,
              editAction: editAction
            }}
            component={ActionItemMembers}/>
        </div>
      </div> : null
    )
  }
}

ActionItem.displayName = "ActionItem"

ActionItem.propTypes = {
  addAction: PropTypes.func,
  availableMembers: PropTypes.array,
  editAction: PropTypes.func,
  intl: PropTypes.object.isRequired,
  type: PropTypes.number
}

const mapStateToProps = (state, {type}) => {
  return {
    availableMembers: mockData.get(type)
  }
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
  ActionItem
)
