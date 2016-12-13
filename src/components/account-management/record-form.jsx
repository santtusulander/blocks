import React, { PropTypes } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import Input from './dns-form-input'
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
    <Input
      {...name}
      id="name-field"
      isVisible={shouldShowField('name')}
      labelID="portal.account.recordForm.hostName.label"
      disabled={edit}
      placeholder={intl.formatMessage({ id: 'portal.account.recordForm.hostName.placeholder'})}
      className="input-narrow host-name-input"
      addonAfter={`.${domain}`}>
      {name.touched && name.error && <div className='error-msg' id='name-err'>{name.error}</div>}
    </Input>
    <Input
      {...value}
      id="value-field"
      isVisible={shouldShowField('value')}
      labelID="portal.account.recordForm.address.label"
      disabled={edit}
      placeholder={intl.formatMessage({ id: 'portal.account.recordForm.address.placeholder'})}>
      {value.touched && value.error && <div className='error-msg' id='value-err'>{value.error}</div>}
    </Input>
    <Input
      {...prio}
      id="prio-field"
      isVisible={shouldShowField('prio')}
      labelID="portal.account.recordForm.prio.label"
      disabled={edit}
      required={false}
      className='input-narrow priority-input'
      placeholder={intl.formatMessage({ id: 'portal.account.recordForm.prio.placeholder'})}>
      {prio.touched && prio.error && <div className='error-msg' id='prio-err'>{prio.error}</div>}
    </Input>
    {shouldShowField('ttl') && [
      <hr/>,
      <Input
        {...ttl}
        id="ttl-field"
        labelID="portal.account.recordForm.ttl.label"
        className='input-narrow ttl-value-input'
        placeholder={intl.formatMessage({ id: 'portal.account.recordForm.ttl.placeholder'})}
        addonAfter="seconds">
        {ttl.touched && ttl.error && <div className='error-msg' id='ttl-err'>{ttl.error}</div>}
      </Input>
    ]}
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
