import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reduxForm, formValueSelector, propTypes } from 'redux-form'

import ASNTypeahead from '../../shared/form-fields/field-form-group-asn-lookup'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

const validate = checkIfExists => ({ asn }, { initialValues }) => {
  if (!asn.length) {
    return { asn: <FormattedMessage id="portal.account.soaForm.validation.required" /> }
  }

  for (const value of asn) {

    if (checkIfExists(value, initialValues)) {
      return { asn: <FormattedMessage id="portal.configuration.traffic.rules.match.input.value.exists.error" /> }
    }
  }
}

const ASNMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, checkIfExists, initialValues }) => {

  const saveMatch = values => {
    const labelText = values.asn.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({
      values,
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.asn.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <ASNTypeahead
        validation={(value) => {
          return value && !checkIfExists(value, initialValues)
        }}
        name="asn"/>
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

/* istanbul ignore next */
const mapStateToProps = (state) => {

  const rules = formValueSelector('gtmForm')(state, 'rules') || []
  const existingValues = []

  rules.forEach((rule => {

    rule.matchArray.forEach(match => {

      if (match.matchType === 'asn') {

        existingValues.push(...match.values.asn.map(asnMatch => Number(asnMatch.id)))

      }
    })
  }))

  const checkIfExists = (value, initialValues) => {

    const isInInitialValues = initialValues.asn.some(({ id }) => Number(id) === value.id)
    //Check if any of the existing rules contain this value
    for (const existing of existingValues) {
      if (!isInInitialValues && existing === value.id) {
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

ASNMatchForm.displayName = 'ASNMatchForm'
ASNMatchForm.propTypes = {
  handleSubmit: PropTypes.func,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  ...propTypes
}

const Form = reduxForm({ form: 'asn-traffic-match', validate })(ASNMatchForm)
Form.defaultProps = { initialValues: { asn: [] } }
export default connect(mapStateToProps)(Form)
