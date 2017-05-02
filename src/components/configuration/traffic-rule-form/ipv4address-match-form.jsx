import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field, formValueSelector, propTypes } from 'redux-form'

import { isValidIP } from '../../../util/validators'

import Typeahead from '../../shared/form-fields/field-form-group-typeahead'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

const validate = checkIfExists => ({ ipv4_address }, { initialValues }) => {
  if (!ipv4_address.length) {
    return { ipv4_address: <FormattedMessage id="portal.account.soaForm.validation.required" /> }
  }

  for (const value of ipv4_address) {

    if (!isValidIP(value.label)) {
      return { ipv4_address: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.input.error" /> }
    }
    if (checkIfExists(value, ipv4_address, initialValues)) {
      return { ipv4_address: <FormattedMessage id="portal.configuration.traffic.rules.match.input.value.exists.error" /> }
    }
  }
}

const IPv4AddressMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl, initialValues, checkIfExists }) => {
  const saveMatch = formValues => {

    const { labelText, values } = formValues.ipv4_address.reduce((aggregate, { label }, index) => {

      aggregate.labelText += `${index ? ',' : ''} ${label}`
      aggregate.values.push({ label, id: label })
      return aggregate

    }, { labelText: '', values: [] })

    onSave({
      values: { ipv4_address: values },
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="ipv4_address"
        component={Typeahead}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.ipv4address.input.placeholder" })}
        multiple={true}
        allowNew={true}
        options={[]}
        validation={(value, allValues) => value && isValidIP(value.label) && !checkIfExists(value, allValues, initialValues)}
        label={<FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address" />}/>
      <FormFooterButtons>
        <Button
          id='cancel-button'
          className="btn-secondary"
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
  onSave: PropTypes.func,
  ...propTypes
}

const stateToProps = (state) => {

  const rules = formValueSelector('gtmForm')(state, 'rules') || []
  const existingValues = []

  rules.forEach((rule => {

    rule.matchArray.forEach(match => {

      if (match.matchType === 'ipv4_address') {

        existingValues.push(...match.values.ipv4_address.map(addressMatch => addressMatch.id))

      }
    })
  }))

  const checkIfExists = (value, allAddresses = [], initialValues) => {
    
    const initialValuesHasValue = initialValues.ipv4_address.some(({ label }) => label === value.label)
    allAddresses = allAddresses.map(ipv4Value => ipv4Value.label)
    let occurrencesInForm = 0
    //Check if any of the existing rules contain this value
    for (const existing of existingValues) {
      if (!initialValuesHasValue && existing === value.label) {
        return true
      }
    }
    //Check if the typeahead already contains this value
    for (const addressValue of allAddresses) {
      if (addressValue === value.label) {
        occurrencesInForm += 1
      }
      if (occurrencesInForm > 1) {
        return true
      }
    }
    return false
  }

  return {
    validate: validate(checkIfExists),
    checkIfExists
  }
}

const Form = reduxForm({ form: 'ipv4_address-traffic-match' })(injectIntl(IPv4AddressMatchForm))
Form.defaultProps = { initialValues: { ipv4_address: [] } }
export default connect(stateToProps)(Form)
