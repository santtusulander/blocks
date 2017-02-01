import React, { Component, PropTypes } from 'react';
import ActionItemButtons from './action-item-buttons'

import { Field } from 'redux-form'

class ActionItems extends Component {
  componentWillReceiveProps(nextProps) {
    if(Array.isArray(nextProps.searchInputValue) && nextProps.searchInputValue.length) {
      nextProps.fields.getAll() ?
        nextProps.fields.getAll().filter((field) => field.actionItemElement === nextProps.searchInputValue[0]).length === 0
        && this.props.fields.push({actionItemElement: nextProps.searchInputValue[0], removed: false}) :
        this.props.fields.push({actionItemElement: nextProps.searchInputValue[0], removed: false})
    }
  }

  render() {
    const { editAction, fields } = this.props

    return (
      <div>
        {fields.map((member, i, fields) => (
            <Field
              key={i}
              label={fields.get(i).actionItemElement}
              className="secondary pull-right"
              name={`${member}.removed`}
              required={false}
              component={ActionItemButtons}
              props={{
                editAction: () => editAction(i)
              }}/>
            )
          )
        }
      </div>
    )
  }
}

ActionItems.displayName = 'ActionItems'

ActionItems.defaultProps = {
  availableActions: [],
  searchInputValue: []
}
ActionItems.propTypes = {
  editAction: PropTypes.func,
  fields: PropTypes.object
}

export default ActionItems
