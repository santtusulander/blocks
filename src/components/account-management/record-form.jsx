import React, { PropTypes } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import Input from './dns-form-input'
import FormGroupSelect from '../form/field-form-group-select'

import keyStrokeSupport from '../../decorators/key-stroke-decorator'

import recordTypes from '../../constants/dns-record-types'

import './record-form.scss'

const RecordForm = ({ domain, loading, edit, onSubmit, cancel, invalid, shouldShowField, intl }) => {
  return (
    <form>
      <Field
        name="type"
        component={input =>
          <FormGroupSelect
            {...input}
            disabled={edit}
            options={recordTypes.map(type => [type, type])}
            label={intl.formatMessage({id: 'portal.account.recordForm.selectRecordType.label'})}/>
      }/>
      <Field
        name="name"
        component={input =>
          <Input
            {...input}
            id="name-field"
            isVisible={shouldShowField('name')}
            labelID="portal.account.recordForm.hostName.label"
            disabled={edit}
            placeholder={intl.formatMessage({ id: 'portal.account.recordForm.hostName.placeholder'})}
            className="input-narrow host-name-input"
            addonAfter={`.${domain}`}/>
      }/>
      <Field
        name="value"
        component={input =>
          <Input
            {...input}
            id="value-field"
            isVisible={shouldShowField('value')}
            labelID="portal.account.recordForm.address.label"
            disabled={edit}
            placeholder={intl.formatMessage({ id: 'portal.account.recordForm.address.placeholder'})}/>
        }/>
      <Field
        name="prio"
        component={input =>
          <Input
            {...input}
            id="prio-field"
            isVisible={shouldShowField('prio')}
            labelID="portal.account.recordForm.prio.label"
            disabled={edit}
            required={false}
            className='input-narrow priority-input'
            placeholder={intl.formatMessage({ id: 'portal.account.recordForm.prio.placeholder'})}/>
      }/>
      {shouldShowField('ttl') && [
        <hr key={0} />,
        <Field
          name="ttl"
          component={input =>
            <Input
              {...input}
              key={1}
              id="ttl-field"
              labelID="portal.account.recordForm.ttl.label"
              className='input-narrow ttl-value-input'
              placeholder={intl.formatMessage({ id: 'portal.account.recordForm.ttl.placeholder'})}
              addonAfter="seconds"/>
        }/>
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
          onClick={onSubmit}>{loading ? <FormattedMessage id='portal.common.button.saving' />  : edit ? <FormattedMessage id='portal.common.button.save' /> : <FormattedMessage id='portal.common.button.add' />}</Button>
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

export default injectIntl(keyStrokeSupport(RecordForm))
