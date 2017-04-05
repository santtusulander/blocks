import React, { PropTypes } from 'react'
import { Field, FieldArray } from 'redux-form'
import { Button } from 'react-bootstrap'
import IconAdd from '../shared/icons/icon-add.jsx'
import ActionItems from './action-items'

import FieldFormGroupTypeahead from '../shared/form-fields/field-form-group-typeahead'

const ActionItemsContainer = ({ addedActionItems, addAvailableAction, addNewAction, availableActions, disableMultipleItems, editAction, intl, label }) => {
  return (
    <div className="action-item">
      <div className="action-item-header">
        <label className="action-item-title">
          {label}
        </label>
        <Button bsStyle="primary" className="btn-icon btn-success pull-right"
          onClick={addNewAction}
          disabled={disableMultipleItems && !!addedActionItems.length}>
          <IconAdd />
        </Button>
      </div>

      <div>
        {!disableMultipleItems && <Field
          allowNew={false}
          className="action-item-search search-input-group"
          component={FieldFormGroupTypeahead}
          disabled={availableActions.length === 0}
          intl={intl}
          name="searchInput"
          options={availableActions}
          props={{
            emptyLabel: intl.formatMessage({id: "portal.common.noAvailabe.text"}, {label: label}),
            placeholder: availableActions.length ? '' :
              intl.formatMessage({id: "portal.common.noAvailabe.text"}, {label: label}),
            onChange: addAvailableAction
          }}
          required={false} />}

        <FieldArray
          intl={intl}
          name="actionItems"
          props={{
            disableUndo: disableMultipleItems,
            editAction: editAction
          }}
          component={ActionItems} />
      </div>
    </div>
  )
}

ActionItemsContainer.displayName = "ActionItemsContainer"
ActionItemsContainer.defaultProps = {
  addedActionItems: []
}

ActionItemsContainer.propTypes = {
  addAvailableAction: PropTypes.func,
  addNewAction: PropTypes.func.isRequired,
  addedActionItems: PropTypes.array,
  availableActions: PropTypes.array,
  disableMultipleItems: PropTypes.bool,
  editAction: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  label: PropTypes.string
}

export default ActionItemsContainer
