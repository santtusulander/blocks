import React, { PropTypes } from 'react';
import ActionItem from './action-item'

import { Field } from 'redux-form'

const ActionItems = ({ disableUndo, editAction, fields }) =>
 (<div>
    {fields.map((member, i, fields) => (
      <Field
        key={i}
        label={fields.get(i).actionItemName}
        className="secondary pull-right"
        name={`${member}.removed`}
        required={false}
        component={ActionItem}
        props={{
          onRemove: disableUndo ? () => fields.remove(i) : null,
          editAction: () => editAction(i)
        }}/>)
      )
    }
  </div>
)

ActionItems.displayName = 'ActionItems'

ActionItems.defaultProps = {
  searchInputValue: []
}
ActionItems.propTypes = {
  disableUndo: PropTypes.bool,
  editAction: PropTypes.func,
  fields: PropTypes.object
}

export default ActionItems
