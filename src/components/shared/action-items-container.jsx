import React, { PropTypes } from 'react'
import { Field, FieldArray } from 'redux-form'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import IconAdd from '../icons/icon-add.jsx'
import ActionItems from './action-items'

import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'

const ActionItemsContainer = ({ addAction, availableActions, editAction, intl, type, label, searchInputValue }) => {
  return (
    type ? <div className="action-item">
      <div className="action-item-header">
        <label className="action-item-title">
          {label}
        </label>
        <Button bsStyle="primary" className="btn-icon btn-success pull-right"
          onClick={addAction}
          disabled={false}>
          <IconAdd />
        </Button>
      </div>

      <div>
        <Field
          allowNew={false}
          className="search-input-group"
          component={FieldFormGroupTypeahead}
          disabled={availableActions.length === 0}
          intl={intl}
          name="searchInput"
          options={availableActions}
          props={{
            emptyLabel: intl.formatMessage({id: "portal.common.noAvailabe.text"}, {label: label}),
            placeholder: availableActions.length ? '' :
              intl.formatMessage({id: "portal.common.noAvailabe.text"}, {label: label})
          }}
          required={false} />

        <FieldArray
          intl={intl}
          name="actionItems"
          props={{
            availableActions:availableActions,
            label: label,
            editAction: editAction,
            searchInputValue: searchInputValue
          }}
          component={ActionItems} />
      </div>
    </div> : null
  )
}

ActionItemsContainer.displayName = "ActionItemsContainer"

ActionItemsContainer.propTypes = {
  addAction: PropTypes.func.isRequired,
  availableActions: PropTypes.array,
  editAction: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  label: PropTypes.string,
  searchInputValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  type: PropTypes.number
}

export default ActionItemsContainer
