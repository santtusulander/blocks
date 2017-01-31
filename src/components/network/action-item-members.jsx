import React, { PropTypes } from 'react';
import { intlShape } from 'react-intl'
import ActionItemMemberButtons from './action-item-member-buttons'
import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'
import { Field } from 'redux-form'

const ActionItemMembers = ({ availableMembers, editAction, fields, intl, label }) => {
  return (
    <div>
      <Field
        allowNew={false}
        className="search-input-group"
        component={FieldFormGroupTypeahead}
        intl={intl}
        name="searchInput"
        newSelectionPrefix={' '}
        options={availableMembers}
        props={{
          onChange: (selected) => {
            if(selected.length) {
              fields.getAll() ?
                fields.getAll().filter((field) => field.actionItemElement === selected[0]).length === 0
                && fields.push({actionItemElement: selected[0], removed: false}) :
                fields.push({actionItemElement: selected[0], removed: false})
            }},
          placeholder: availableMembers.length ? '' :
            intl.formatMessage({id: "portal.network.podForm.actionItem.noAvailabe.text"}, {label: label})
        }}
        required={false} />
      {fields.map((member, i, fields) => (
          <Field
            key={i}
            label={fields.get(i).actionItemElement}
            className="secondary pull-right"
            name={`${member}.removed`}
            required={false}
            component={ActionItemMemberButtons}
            props={{
              editAction: () => editAction(i)
            }}/>
          )
        )
      }
    </div>
  )
}

ActionItemMembers.displayName = 'ActionItemMembers'

ActionItemMembers.defaultProps = {
  availableMembers: []
}
ActionItemMembers.propTypes = {
  availableMembers: PropTypes.array,
  editAction: PropTypes.func,
  fields: PropTypes.object,
  intl: intlShape.isRequired,
  label: PropTypes.string
}

export default ActionItemMembers
