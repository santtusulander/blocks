import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import SelectWrapper from '../select-wrapper'

import recordTypes, { recordFields } from '../../constants/dns-record-types'

import { checkForErrors } from '../../util/helpers'

import './dns-edit-form.scss'

const validate = ({ recordType = '', recordName = '', targetValue = '', ttl = '' }) => {
  const conditions = {
    ttl: {
      condition: !new RegExp('^[0-9]*$').test(ttl),
      errorText: 'TTL value must be a number.'
    },
    targetValue: {
      condition: !new RegExp('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$').test(targetValue),
      errorText: 'Address must be an IP address.'
    }
  }
  return checkForErrors({ recordType, recordName, targetValue, ttl }, conditions)
}

const DnsEditForm = ({ domain, edit, onSave, onCancel, invalid, fields: { recordType, recordName, targetValue, ttl } }) => {
  const title             = edit ? 'Edit DNS Record' : 'New DNS Record'
  const actionButtonTitle = edit ? 'Save' : 'Add'
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

          {recordFields.recordName.has(recordTypes.value) &&
            <Input
              {...recordName}
              type="text"
              label="Host Name"
              placeholder="Enter Record Name"
              addonAfter={`.${domain}`}
              className='input-narrow record-name-input'/>}
          {recordName.touched && recordName.error &&
          <div className='error-msg errorRecordName'>{recordName.error}</div>}
          <hr/>

          {recordFields.recordName.has(recordTypes.value) && <Input
            {...targetValue}
            type="text"
            label="Address"
            placeholder="Enter Address"/>}
          {targetValue.touched && targetValue.error && <div className='error-msg'>{targetValue.error}</div>}
          <hr/>

          {recordFields.ttl.has(recordTypes.value) && <Input
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
