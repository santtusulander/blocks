import React, { PropTypes } from 'react'
import { Field, FieldArray } from 'redux-form'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import IconAdd from '../icons/icon-add.jsx'
import ActionItems from './action-items'

import { DISCOVERY_METHOD_TYPE } from '../../constants/network'

import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'

const ActionItemsContainer = ({ addAction, availableActions, editAction, intl, type, searchInputValue }) => {
  const label = DISCOVERY_METHOD_TYPE
    .filter(elm => elm.get('key') === type)
    .getIn([0, 'label'])
  return (
    type ? <div className="action-item">
      <div className="action-item-header">
        <label className="action-item-title">
          <FormattedMessage
            id="portal.common.add.label.text"
            values={{label: label}} />
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
  searchInputValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  type: PropTypes.number
}

export default ActionItemsContainer
