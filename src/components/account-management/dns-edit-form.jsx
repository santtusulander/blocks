import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import SelectWrapper from '../select-wrapper'

import recordTypes from '../../constants/dns-record-types.js'

import { checkForErrors } from '../../util/helpers'

import './dns-edit-form.scss'

const validate = (values) => checkForErrors(values)

const recordTypeOptions = recordTypes.map((value, i) => <option key={i} value={value}>{value}</option>)

const DnsEditForm = ({ domain, edit, onSave, onCancel, invalid, fields: { recordType, recordName, targetValue, ttl } }) => {
  const title             = edit ? 'Edit DNS Record' : 'New DNS Record'
  const actionButtonTitle = edit ? 'Save' : 'Add'
  return (
    <Modal show={true} dialogClassName="dns-edit-form-sidebar">
      <Modal.Header>
        <h1>{title}</h1>
        {edit && <p>{recordName}</p>}
      </Modal.Header>
      <Modal.Body>
        <form>
          <SelectWrapper
            {...recordType}
            label="Select Record Type">
            {recordTypeOptions}
          </SelectWrapper>
          <hr/>
          <Input
            {...recordName}
            type="text"
            label="Record Name"
            placeholder="Enter Record Name"
            addonAfter={`.${domain}`}
            className='input-narrow recordNameInput'/>
          {recordName.touched && recordName.error &&
          <div className='error-msg errorRecordName'>{recordName.error}</div>}
          <hr/>
          <Input
            {...targetValue}
            type="text"
            label="Target Value"
            placeholder="Enter Target Value"
          />
          {targetValue.touched && targetValue.error && <div className='error-msg'>{targetValue.error}</div>}
          <hr/>
          <Input
            {...ttl}
            type="text"
            label="TTL Value"
            placeholder="Enter TTL Value"
            className='input-narrow'
            addonAfter='seconds'/>
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
