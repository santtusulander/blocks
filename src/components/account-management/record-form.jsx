import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import Input from '../form/field-form-group'
import FormGroupSelect from '../form/field-form-group-select'
import FormFooterButtons from '../form/form-footer-buttons'
import FieldFormGroupNumber from '../form/field-form-group-number'

import recordTypes from '../../constants/dns-record-types'
import { DNS_MIN_TTL, DNS_MAX_TTL, DNS_MIN_PRIO, DNS_MAX_PRIO } from '../../constants/account-management-options'

const RecordForm = ({ type, submitting, domain, edit, onSubmit, cancel, handleSubmit, invalid, shouldShowField, intl }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="type"
        disabled={edit}
        options={recordTypes.map(type => [type, type])}
        component={FormGroupSelect}
        label={<FormattedMessage id="portal.account.recordForm.selectRecordType.label"/>}/>
      {shouldShowField('name') &&
        <Field
          name="name"
          id="name-field"
          disabled={edit}
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.hostName.placeholder'})}
          className="input-narrow host-name-input"
          addonAfter={`.${domain}`}
          component={Input}
          required={type !== 'NS'}
          label={<FormattedMessage id="portal.account.recordForm.hostName.label" />}/>
      }
      {shouldShowField('value') &&
        <Field
          name="value"
          id="value-field"
          disabled={edit}
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.address.placeholder'})}
          component={Input}
          label={<FormattedMessage id="portal.account.recordForm.address.label" />}/>
      }
      {shouldShowField('prio') &&
        <Field
          name="prio"
          id="prio-field"
          min={DNS_MIN_PRIO}
          max={DNS_MAX_PRIO}
          required={false}
          disabled={edit}
          className='input-narrow priority-input'
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.prio.placeholder'})}
          component={FieldFormGroupNumber}
          label={<FormattedMessage id="portal.account.recordForm.prio.label" />}/>
      }
      {shouldShowField('ttl') && [
        <hr key={0} />,
        <Field
          name="ttl"
          key={1}
          min={DNS_MIN_TTL}
          max={DNS_MAX_TTL}
          id="ttl-field"
          className='input-narrow ttl-value-input'
          placeholder={intl.formatMessage({ id: 'portal.account.recordForm.ttl.placeholder'})}
          addonAfter="seconds"
          component={FieldFormGroupNumber}
          label={<FormattedMessage id="portal.account.recordForm.ttl.label" />}/>
      ]}

      <FormFooterButtons>
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
          {submitting ? <FormattedMessage id='portal.common.button.saving' />
                      : edit ? <FormattedMessage id='portal.common.button.save' />
                      : <FormattedMessage id='portal.common.button.add' />}
        </Button>
      </FormFooterButtons>

    </form>
  )
}

RecordForm.displayName = 'RecordForm'
RecordForm.propTypes = {
  cancel: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onSubmit: PropTypes.func,
  shouldShowField: PropTypes.func,
  submitting: PropTypes.bool,
  type: PropTypes.string
}

export default injectIntl(RecordForm)
