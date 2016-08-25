import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import SelectWrapper from '../select-wrapper'

import recordTypes, { recordFields } from '../../constants/dns-record-types'

import { checkForErrors } from '../../util/helpers'

import './record-form.scss'

/**
 *
 * Filter fields to validate according to the fields that get rendered for the active record type.
 * The 'recordFields' -constant dictates which fields get rendered per record type.
 */

const isShown = recordType => field => recordFields[field].includes(recordType)
const filterFields = fields => {
  let filteredFields = {}
  for(const field in fields) {
    if (isShown(fields.recordType)(field)) {
      filteredFields[field] = fields[field]
    }
  }
  return filteredFields
}

const validate = fields => {
  let filteredFields = filterFields(fields)
  delete filteredFields.hostName
  const conditions = {
    priority: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.priority),
      errorText: 'Priority must be a number.'
    },
    ttl: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.ttl),
      errorText: 'TTL value must be a number.'
    },
    targetValue: {
      condition: !new RegExp('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$').test(filteredFields.targetValue),
      errorText: 'Address must be an IP address.'
    }
  }
  return checkForErrors(filteredFields, conditions)
}


const DnsEditForm = ({ domain, edit, onSave, onCancel, invalid, fields: { recordType, hostName, targetValue, ttl, priority }, values }) => {
  const title             = edit ? 'Edit DNS Record' : 'New DNS Record'
  const actionButtonTitle = edit ? 'Save' : 'Add'
  const shouldShowField = isShown(recordType.value)
  return (
    <Modal show={true} dialogClassName="dns-edit-form-sidebar">
      <Modal.Header>
        <h1>{title}</h1>
        {edit && <p>{hostName.value}</p>}
      </Modal.Header>
      <Modal.Body>
        <form>
          <SelectWrapper
            {...recordType}
            options={recordTypes.map(type => [type, type])}
            label="Select Record Type"/>
          {shouldShowField('hostName') &&
            <Input
              {...hostName}
              type="text"
              label="Host Name"
              placeholder="Enter Host Name"
              addonAfter={`.${domain}`}
              className='input-narrow host-name-input'/>}
          {hostName.touched && hostName.error && <div className='error-msg'>{hostName.error}</div>}
          {shouldShowField('targetValue') &&
            <Input
              {...targetValue}
              type="text"
              label="Address"
              placeholder="Enter Address"/>}
          {targetValue.touched && targetValue.error && <div className='error-msg'>{targetValue.error}</div>}
          {shouldShowField('priority') &&
            <Input
              {...priority}
              type="text"
              label="Priority"
              placeholder="Enter Priority"
              className='input-narrow priority-input'/>}
            {priority.touched && priority.error && <div className='error-msg'>{priority.error}</div>}
          {shouldShowField('ttl') && <hr/>}
          {shouldShowField('ttl') &&
            <Input
              {...ttl}
              type="text"
              label="TTL Value"
              placeholder="Enter TTL Value"
              className='input-narrow ttl-value-input'
              addonAfter='seconds'/>}
          {ttl.touched && ttl.error && <div className='error-msg'>{ttl.error}</div>}
          <ButtonToolbar className="text-right extra-margin-top">
            <Button className="btn-outline" onClick={onCancel}>Cancel</Button>
            <Button disabled={invalid} bsStyle="primary"
              onClick={() => onSave(filterFields(values))}>{actionButtonTitle}</Button>
          </ButtonToolbar>
        </form>
      </Modal.Body>
    </Modal>
  )
}

DnsEditForm.displayName = 'DnsEditForm'

DnsEditForm.propTypes = {
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object.isRequired,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({
  form: 'dns-edit',
  fields: ['recordType', 'hostName', 'targetValue', 'ttl', 'priority'],
  validate
})(DnsEditForm)
