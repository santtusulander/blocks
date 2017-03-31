import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import { isValidIP } from '../../../util/validators'

import Typeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = ({ ipv4Address }) => {
  if (!ipv4Address.length) {
    return { ipv4CIDR: <FormattedMessage id="portal.account.soaForm.validation.required" /> }
  }

  for (const value of ipv4Address) {

    if (!isValidIP(value.label)) {
      return { ipv4Address: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.input.error" /> }
    }
  }
}

const IPv4AddressMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl }) => {

  const saveMatch = values => {
    const labelText = values.ipv4Address.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({
      values,
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="ipv4Address"
        component={Typeahead}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.ipv4address.input.placeholder" })}
        multiple={true}
        allowNew={true}
        options={[]}
        validation={(value) => value && isValidIP(value.label)}
        label={<FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address" />}/>
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

IPv4AddressMatchForm.displayName = 'IPv4AddressMatchForm'
IPv4AddressMatchForm.propTypes = {
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

const Form = reduxForm({ form: 'ipv4Address-traffic-match', validate })(injectIntl(IPv4AddressMatchForm))
Form.defaultProps = { initialValues: { ipv4Address: [] } }
export default Form
