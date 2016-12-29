import React, { PropTypes } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import FormGroupSelect from '../form/field-form-group-select'
import Input from '../form/field-form-group'
//import Input from './dns-form-input'

import recordTypes from '../../constants/dns-record-types'

import './record-form.scss'

const RecordForm = ({ submitting, domain, edit, onSubmit, cancel, handleSubmit, invalid, shouldShowField, intl }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="type"
        disabled={edit}
        options={recordTypes.map(type => [type, type])}
        label={intl.formatMessage({id: 'portal.account.recordForm.selectRecordType.label'})}
        component={FormGroupSelect}/>
      {shouldShowField('name') &&
        <Field
          name="name"
          //id="name-field"
          disabled={edit}
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.hostName.placeholder'})}
          className="input-narrow host-name-input"
          addonAfter={`.${domain}`}
          component={Input}>
          <FormattedMessage id="portal.account.recordForm.hostName.label" />
        </Field>}
      {shouldShowField('value') &&
        <Field
          name="value"
          id="value-field"
          disabled={edit}
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.address.placeholder'})}
          component={Input}>
          <FormattedMessage id="portal.account.recordForm.address.label" />
        </Field>}
      {shouldShowField('prio') &&
        <Field
          name="prio"
          id="prio-field"
          disabled={edit}
          required={false}
          className='input-narrow priority-input'
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.prio.placeholder'})}
          component={Input}>
          <FormattedMessage id="portal.account.recordForm.prio.label" />
        </Field>}
      {shouldShowField('ttl') && [
        <hr key={0} />,
        <Field
          name="ttl"
          key={1}
          id="ttl-field"
          labelID="portal.account.recordForm.ttl.label"
          className='input-narrow ttl-value-input'
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.ttl.placeholder'})}
          addonAfter="seconds"
          component={Input}>
          <FormattedMessage id="portal.account.recordForm.ttl.label" />
        </Field>
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
          type='submit'
          disabled={invalid || submitting}
          bsStyle="primary">
          {submitting ? <FormattedMessage id='portal.common.button.saving' />  : edit ? <FormattedMessage id='portal.common.button.save' /> : <FormattedMessage id='portal.common.button.add' />}
        </Button>
      </ButtonToolbar>
    </form>
  )
}

RecordForm.propTypes = {
  cancel: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  shouldShowField: PropTypes.func
}

export default injectIntl(RecordForm)
