import React, { PropTypes } from 'react'
import { Input, ButtonToolbar, Button } from 'react-bootstrap'

import SelectWrapper from '../select-wrapper'

import recordTypes from '../../constants/dns-record-types'

import keyStrokeSupport from '../../decorators/key-stroke-decorator'

import './record-form.scss'

export const RecordForm = ({ domain, loading, edit, submit, cancel, invalid, fields: { type, name, value, ttl, prio }, shouldShowField }) =>
  <form>
    <SelectWrapper
      {...type}
      options={recordTypes.map(type => [type, type])}
      label="Select Record Type"/>
    {shouldShowField('name') &&
      <Input
        {...name}
        type="text"
        id='name-field'
        label="Host Name"
        placeholder="Enter Host Name"
        addonAfter={`.${domain}`}
        className='input-narrow host-name-input'/>}
    {name.touched && name.error && <div className='error-msg' id='name-err'>{name.error}</div>}
    {shouldShowField('value') &&
      <Input
        {...value}
        id='value-field'
        type="text"
        label="Address"
        placeholder="Enter Address"/>}
    {value.touched && value.error && <div className='error-msg' id='value-err'>{value.error}</div>}
    {shouldShowField('prio') &&
      <Input
        {...prio}
        id='prio-field'
        type="text"
        label="Priority"
        placeholder="Enter Priority"
        className='input-narrow priority-input'/>}
      {prio.touched && prio.error && <div className='error-msg' id='prio-err'>{prio.error}</div>}
    {shouldShowField('ttl') && <hr/>}
    {shouldShowField('ttl') &&
      <Input
        {...ttl}
        id='ttl-field'
        type="text"
        label="TTL Value"
        placeholder="Enter TTL Value"
        className='input-narrow ttl-value-input'
        addonAfter='seconds'/>}
    {ttl.touched && ttl.error && <div className='error-msg' id='ttl-err'>{ttl.error}</div>}
    <ButtonToolbar className="text-right extra-margin-top">
      <Button
        id='cancel-button'
        className="btn-outline"
        onClick={cancel}>
        Cancel
      </Button>
      <Button
        id='submit-button'
        disabled={invalid || loading}
        bsStyle="primary"
        onClick={submit}>{loading ? 'Saving...' : edit ? 'Save' : 'Add'}</Button>
    </ButtonToolbar>
  </form>

RecordForm.displayName = 'RecordForm'

RecordForm.propTypes = {
  cancel: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  loading: PropTypes.bool,
  shouldShowField: PropTypes.func,
  submit: PropTypes.func,
  values: PropTypes.object
}

export default keyStrokeSupport(RecordForm)
