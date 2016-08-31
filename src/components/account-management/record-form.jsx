import React, { PropTypes } from 'react'
import { Input, ButtonToolbar, Button } from 'react-bootstrap'

import SelectWrapper from '../select-wrapper'

import recordTypes from '../../constants/dns-record-types'

import './record-form.scss'

const RecordForm = ({ domain, loading, edit, onSave, onCancel, invalid, fields: { type, name, value, ttl, priority }, values, shouldShowField }) =>
  <form>
    <SelectWrapper
      {...type}
      options={recordTypes.map(type => [type, type])}
      label="Select Record Type"/>
    {shouldShowField('name') &&
      <Input
        {...name}
        type="text"
        label="Host Name"
        placeholder="Enter Host Name"
        addonAfter={`.${domain}`}
        className='input-narrow host-name-input'/>}
    {name.touched && name.error && <div className='error-msg'>{name.error}</div>}
    {shouldShowField('value') &&
      <Input
        {...value}
        type="text"
        label="Address"
        placeholder="Enter Address"/>}
    {value.touched && value.error && <div className='error-msg'>{value.error}</div>}
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
      <Button disabled={invalid || loading} bsStyle="primary"
        onClick={() => onSave(values)}>{edit ? 'Save' : 'Add'}</Button>
    </ButtonToolbar>
  </form>

RecordForm.displayName = 'RecordForm'

RecordForm.propTypes = {
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  shouldShowField: PropTypes.func,
  values: PropTypes.object
}

export default RecordForm
