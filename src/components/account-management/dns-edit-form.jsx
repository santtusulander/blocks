import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import SelectWrapper from '../select-wrapper'

import recordTypes, { recordFields } from '../../constants/dns-record-types'

import { checkForErrors } from '../../util/helpers'

import './dns-edit-form.scss'

/**
 *
 * Filter fields to validate according to the fields that get rendered for the active record type.
 * The 'recordFields' -constant dictates which fields get rendered per record type.
 */

const isShown = recordType => field => recordFields[field].includes(recordType)

const validate = fields => {
  let filteredFields = {}
  for(const field in fields) {
    if (isShown(fields.recordType)(field)) {
      filteredFields[field] = fields[field]
    }
  }
  const conditions = {
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


const DnsEditForm = ({ domain, edit, onSave, onCancel, invalid, fields: { recordType, recordName, targetValue, ttl } }) => {
  const title             = edit ? 'Edit DNS Record' : 'New DNS Record'
  const actionButtonTitle = edit ? 'Save' : 'Add'
  const shouldShowField = isShown(recordType.value)
  return (
    <Modal show={true} dialogClassName="dns-edit-form-sidebar">
      <Modal.Header>
        <h1>{title}</h1>
        {edit && <p>{recordName.value}</p>}
      </Modal.Header>
      <Modal.Body>
        <form>
          <SelectWrapper
            {...recordType}
            options={recordTypes.map(type => [type, type])}
            label="Select Record Type"/>

          {shouldShowField('recordName') &&
            <Input
              {...recordName}
              type="text"
              label="Host Name"
              placeholder="Enter Host Name"
              addonAfter={`.${domain}`}
              className='input-narrow record-name-input'/>}
          {recordName.touched && recordName.error && <div className='error-msg'>{recordName.error}</div>}

          {shouldShowField('targetValue') && <hr/>}
          {shouldShowField('targetValue') &&
            <Input
              {...targetValue}
              type="text"
              label="Address"
              placeholder="Enter Address"/>}
          {targetValue.touched && targetValue.error && <div className='error-msg'>{targetValue.error}</div>}

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
              onClick={onSave}>{actionButtonTitle}</Button>
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
  fields: ['recordType', 'recordName', 'targetValue', 'ttl'],
  validate
})(DnsEditForm)
