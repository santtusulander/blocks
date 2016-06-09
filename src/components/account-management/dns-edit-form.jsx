import React, { Component } from 'react'
import { Modal, Input, ButtonToolbar, Button, Label } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

import recordTypes from '../../constants/dns-record-types.js'

import './dns-edit-form.scss'

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

const recordTypeOptions = recordTypes.map( (e,i) => {
    return <option key={i} value={e}>{e}</option>;
});

class DnsEditForm extends Component {
  render() {
    const props = this.props

    const title = props.edit ? 'Edit DNS Record' : 'New DNS Record'
    const actionButtonTitle = props.edit ? 'Save' : 'Add'

    const { fields: { recordType, recordName, targetValue, ttl} } = props

    return (

      <Modal show={true} dialogClassName="dns-edit-form-sidebar">

        <Modal.Header>
          <h1>{title}</h1>
          <p>Lorem ipsum</p>
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
              className='input-narrow recordNameInput'
            />

          {recordName.touched && recordName.error && <div className='error-msg errorRecordName'>{recordName.error}</div>}

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
              <Button disabled={ Object.keys(props.errors).length > 0 } bsStyle="primary" onClick={props.onSave} >{ actionButtonTitle }</Button>
            </ButtonToolbar>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}

DnsEditForm.displayName = 'DnsEditForm'

DnsEditForm.propTypes = {
  edit: React.PropTypes.bool,
  fields: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
}

export default reduxForm({
  form: 'dns-edit',
  fields: ['recordType', 'recordName', 'targetValue', 'ttl'],
  validate
})(DnsEditForm)
