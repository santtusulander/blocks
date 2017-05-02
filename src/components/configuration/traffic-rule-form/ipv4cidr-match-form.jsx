import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector, propTypes } from 'redux-form'

import { isValidIPv4Cidr } from '../../../util/validators'

import Typeahead from '../../shared/form-fields/field-form-group-typeahead'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

const validate = checkIfExists => ({ ipv4_cidr_prefix }, { initialValues }) => {

  if (!ipv4_cidr_prefix.length) {
    return { ipv4_cidr_prefix: <FormattedMessage id="portal.account.soaForm.validation.required" /> }
  }

  for (const value of ipv4_cidr_prefix) {

    if (!isValidIPv4Cidr(value.label)) {
      return { ipv4_cidr_prefix: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.input.error" /> }
    }
    if (checkIfExists(value, ipv4_cidr_prefix, initialValues)) {
      return { ipv4_cidr_prefix: <FormattedMessage id="portal.configuration.traffic.rules.match.input.value.exists.error" /> }
    }
  }
}

const IPv4CIDRMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl, initialValues, checkIfExists }) => {

  const saveMatch = formValues => {

    const { labelText, values } = formValues.ipv4_cidr_prefix.reduce((aggregate, { label }, index) => {

      aggregate.labelText += `${index ? ',' : ''} ${label}`
      aggregate.values.push({ label, id: label })
      return aggregate

    }, { labelText: '', values: [] })

    onSave({
      values: { ipv4_cidr_prefix: values },
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="ipv4_cidr_prefix"
        component={Typeahead}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.ipv4cidr.input.placeholder" })}
        multiple={true}
        allowNew={true}
        options={[]}
        validation={(value, allValues) => value && isValidIPv4Cidr(value.label) && !checkIfExists(value, allValues, initialValues)}
        label={<FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr" />}/>
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

IPv4CIDRMatchForm.displayName = 'IPv4CIDRMatchForm'
IPv4CIDRMatchForm.propTypes = {
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

      if (match.matchType === 'ipv4_cidr_prefix') {

        existingValues.push(...match.values.ipv4_cidr_prefix.map(addressMatch => addressMatch.id))

      }
    })
  }))

  const checkIfExists = (value, allCidrs = [], initialValues) => {
    
    const isInInitialValues = initialValues.ipv4_cidr_prefix.some(({ label }) => label === value.label)
    allCidrs = allCidrs.map(cidrValue => cidrValue.label)
    let occurrencesInForm = 0

    //Check if any of the existing rules contain this value
    for (const existing of existingValues) {
      if (!isInInitialValues && existing === value.label) {
        return true
      }
    }
    //Check if the typeahead already contains this value
    for (const cidrValue of allCidrs) {
      if (cidrValue === value.label) {
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

const Form = reduxForm({ form: 'ipv4_cidr_prefix-traffic-match' })(injectIntl(IPv4CIDRMatchForm))
Form.defaultProps = { initialValues: { ipv4_cidr_prefix: [] } }
export default connect(stateToProps)(Form)
