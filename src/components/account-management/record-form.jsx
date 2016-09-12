import React, { PropTypes } from 'react'
import { Input, ButtonToolbar, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SelectWrapper from '../select-wrapper'

import recordTypes from '../../constants/dns-record-types'

import './record-form.scss'

const RecordForm = ({ domain, loading, edit, onSave, onCancel, invalid, fields: { type, name, value, ttl, prio }, values, shouldShowField, intl }) =>
  <form>
    <SelectWrapper
      {...type}
      disabled={edit}
      options={recordTypes.map(type => [type, type])}
      label={intl.formatMessage({id: 'portal.account.recordForm.label.selectRecordType'})}
    />
    {shouldShowField('name') &&
      <Input
        {...name}
        disabled={edit}
        type="text"
        label={intl.formatMessage({id: 'portal.account.recordForm.label.hostName'})}
        placeholder={intl.formatMessage({ id: 'portal.account.recordForm.placeholder.hostName'})}
        addonAfter={`.${domain}`}
        className='input-narrow host-name-input'
      />
    }
    {name.touched && name.error && <div className='error-msg'>{name.error}</div>}
    {shouldShowField('value') &&
      <Input
        {...value}
        disabled={edit}
        type="text"
        label={intl.formatMessage({id: 'portal.account.recordForm.label.address'})}
        placeholder={intl.formatMessage({id: 'portal.account.recordForm.placeholder.address'})}
      />
    }
    {value.touched && value.error && <div className='error-msg'>{value.error}</div>}
    {shouldShowField('prio') &&
      <Input
        {...prio}
        disabled={edit}
        type="text"
        label={intl.formatMessage({id: 'portal.account.recordForm.label.prio'})}
        placeholder={intl.formatMessage({id: 'portal.account.recordForm.placeholder.prio'})}
        className='input-narrow priority-input'/>}
      {prio.touched && prio.error && <div className='error-msg'>{prio.error}</div>}
    {shouldShowField('ttl') && <hr/>}
    {shouldShowField('ttl') &&
      <Input
        {...ttl}
        type="text"
        label={intl.formatMessage({id: 'portal.account.recordForm.label.ttl'})}
        placeholder={intl.formatMessage({id: 'portal.account.recordForm.placeholder.ttl'})}
        className='input-narrow ttl-value-input'
        addonAfter='seconds'/>}
    {ttl.touched && ttl.error && <div className='error-msg'>{ttl.error}</div>}
    <ButtonToolbar className="text-right extra-margin-top">
      <Button className="btn-outline" onClick={onCancel}><FormattedMessage id='portal.common.button.cancel' /></Button>
      <Button
        disabled={invalid || loading}
        bsStyle="primary"
        onClick={() => onSave(values)}>{loading ? <FormattedMessage id='portal.common.button.saving' /> : edit ? <FormattedMessage id='portal.common.button.save' /> : <FormattedMessage id='portal.common.button.add' />}</Button>
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

export default injectIntl(RecordForm)
