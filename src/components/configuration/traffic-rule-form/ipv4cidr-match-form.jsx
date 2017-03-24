import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import { isValidIPv4Address } from '../../../util/validators'

import Typeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = ({ ipv4CIDR = [] }) => {
  if (!ipv4CIDR.length) {
    return { ipv4CIDR: <FormattedMessage id="portal.account.soaForm.validation.required" /> }
  }

  for(const value of ipv4CIDR) {

    if (!isValidIPv4Address(value.label, true)) {
      return { ipv4CIDR: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.input.error" /> }
    }
  }
}

const IPv4CIDRMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl }) => {

  const saveMatch = values => {
    const labelText = values.ipv4CIDR.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({
      values,
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="ipv4CIDR"
        component={Typeahead}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.ipv4cidr.input.placeholder" })}
        multiple={true}
        allowNew={true}
        options={[]}
        validation={(value) => value && isValidIPv4Address(value.label, true)}
        label={<FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr" />}/>
        <FormFooterButtons>
          <Button
            id='cancel-button'
            className="btn-outline"
            onClick={onCancel}>
            <FormattedMessage id='portal.common.button.cancel' />
          </Button>
          <Button
            id='submit-button'
            type='submit'
            disabled={invalid}
            bsStyle="primary">
            {typeof matchIndex === 'number'
              ? <FormattedMessage id='portal.common.button.save' />
              : <FormattedMessage id='portal.common.button.add' />}
          </Button>
        </FormFooterButtons>
    </form>
  )
}

IPv4CIDRMatchForm.displayName = 'IPv4CIDRMatchForm'
IPv4CIDRMatchForm.propTypes = {
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({ form: 'ipv4CIDR-traffic-match', validate })(injectIntl(IPv4CIDRMatchForm))
