import React, { PropTypes } from 'react'
import { Input, ButtonToolbar, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SelectWrapper from '../select-wrapper'
import keyStrokeSupport from '../../decorators/key-stroke-decorator'
import recordTypes from '../../constants/dns-record-types'

import './record-form.scss'

const RecordForm = ({ domain, loading, edit, submit, cancel, invalid, fields: { type, name, value, ttl, prio }, shouldShowField, intl }) =>
  <form>
    <SelectWrapper
      {...type}
      disabled={edit}
      options={recordTypes.map(type => [type, type])}
      label={intl.formatMessage({id: 'portal.account.recordForm.selectRecordType.label'})}
    />
    {shouldShowField('name') &&
      <Input
        {...name}
        disabled={edit}
        type="text"
        id='name-field'
        label={intl.formatMessage({id: 'portal.account.recordForm.hostName.label'}) + ' *'}
        placeholder={intl.formatMessage({ id: 'portal.account.recordForm.hostName.placeholder'})}
        addonAfter={`.${domain}`}
        className='input-narrow host-name-input'/>}
    {name.touched && name.error && <div className='error-msg' id='name-err'>{name.error}</div>}
    {shouldShowField('value') &&
      <Input
        {...value}
        id='value-field'
        disabled={edit}
        type="text"
        label={intl.formatMessage({id: 'portal.account.recordForm.address.label'}) + ' *'}
        placeholder={intl.formatMessage({id: 'portal.account.recordForm.address.placeholder'})}/>}
    {value.touched && value.error && <div className='error-msg' id='value-err'>{value.error}</div>}
    {shouldShowField('prio') &&
      <Input
        {...prio}
        id='prio-field'
        disabled={edit}
        type="text"
        label={intl.formatMessage({id: 'portal.account.recordForm.prio.label'})}
        placeholder={intl.formatMessage({id: 'portal.account.recordForm.prio.placeholder'})}
        className='input-narrow priority-input'/>}
      {prio.touched && prio.error && <div className='error-msg' id='prio-err'>{prio.error}</div>}
    {shouldShowField('ttl') && <hr/>}
    {shouldShowField('ttl') &&
      <Input
        {...ttl}
        id='ttl-field'
        type="text"
        label={intl.formatMessage({id: 'portal.account.recordForm.ttl.label'}) + ' *'}
        placeholder={intl.formatMessage({id: 'portal.account.recordForm.ttl.placeholder'})}
        className='input-narrow ttl-value-input'
        addonAfter='seconds'/>}
    {ttl.touched && ttl.error && <div className='error-msg' id='ttl-err'>{ttl.error}</div>}
    <ButtonToolbar className="text-right extra-margin-top">
      <Button
        id='cancel-button'
        className="btn-outline"
        onClick={cancel}>
        <FormattedMessage id='portal.common.button.cancel' />
      </Button>
      <Button
        id='submit-button'
        disabled={invalid || loading}
        bsStyle="primary"
        onClick={submit}>{loading ? <FormattedMessage id='portal.common.button.saving' />  : edit ? <FormattedMessage id='portal.common.button.save' /> : <FormattedMessage id='portal.common.button.add' />}</Button>
    </ButtonToolbar>
  </form>

RecordForm.displayName = 'RecordForm'

RecordForm.propTypes = {
  cancel: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  loading: PropTypes.bool,
  shouldShowField: PropTypes.func,
  submit: PropTypes.func
}

export default injectIntl(keyStrokeSupport(RecordForm))
