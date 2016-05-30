import React from 'react'
import { Modal, Input, ButtonToolbar, Button, Label } from 'react-bootstrap'

import {reduxForm} from 'redux-form'

import recordTypes from '../../constants/dns-record-types.js'
import Select from '../select.jsx'

import './dns-edit-form.scss'

const recordTypeOptions = recordTypes.map( (e) => {
    return <option value={e}>{e}</option>;
});

let errors = {}

const validate = values => {
  errors = {}

  const { recordType, recordName, targetValue, ttl } = values

  if (!recordType || recordType.length === 0) errors.recordType = 'RecordType is required'
  if (!ttl || ttl.length === 0) errors.ttl = 'TTL is required'
  if (!recordName || recordName.length === 0 ) errors.recordName = 'RecordName is required'
  if (!targetValue ||targetValue.length === 0) errors.targetValue = 'TargetValue is required'

  return errors;
}

const DnsEditForm = (props) => {

  const title = props.edit ? 'Edit DNS Record' : 'New DNS Record'
  const actionButtonTitle = props.edit ? 'Save' : 'Add'

  const { fields: { recordType, recordName, targetValue, ttl} } = props

  return (
    <Modal
      show={props.show}
      onHide={props.onCancel}
      dialogClassName="dns-edit-form"
    >

      <Modal.Header>
        <h1>{ title }</h1>
        <p>Lorem ipsum dolor</p>
      </Modal.Header>

      <Modal.Body>
        <form>

          <Input
            { ...recordType }
            type="select"
            label="Select Record Type"
            placeholder="Select"
          >
            { recordTypeOptions }
          </Input>

          <Input
            { ...recordName }
            type="text"
            label="Record Name"
            placeholder="Enter Record Name"
            addonAfter={ `.${props.domain}` }
            className='input-narrow'
          />

          {recordName.touched && recordName.error && <div className='error-msg'>{recordName.error}</div>}

          <Input
            { ...targetValue }
          type="text"
          label="Target Value"
          placeholder="Enter Target Value"
          />

          {targetValue.touched && targetValue.error && <div className='error-msg'>{targetValue.error}</div>}

          <Input
            { ...ttl }
          type="text"
          label="TTL Value"
          placeholder="Enter TTL Value"
          className='input-narrow'
          addonAfter='seconds'
          />

          {ttl.touched && ttl.error && <div className='error-msg'>{ttl.error}</div>}

          <ButtonToolbar className="text-right extra-margin-top">
            <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
            <Button disabled={ Object.keys(errors).length } bsStyle="primary" onClick={props.onSave} >{ actionButtonTitle }</Button>
          </ButtonToolbar>
        </form>
      </Modal.Body>

    </Modal>
  )
}

DnsEditForm.propTypes = {
  edit: React.PropTypes.bool,
  fields: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  show: React.PropTypes.bool
}

export default reduxForm({
  fields: ['recordType', 'recordName', 'targetValue', 'ttl'],
  form: 'dns-edit',
  validate
})(DnsEditForm)
