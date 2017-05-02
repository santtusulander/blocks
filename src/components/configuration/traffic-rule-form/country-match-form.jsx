import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import countriesList from '../../../constants/three-digit-countries'
import { checkForErrors } from '../../../util/helpers'

import Typeahead from '../../shared/form-fields/field-form-group-typeahead'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

const validate = ({ country }) => checkForErrors({ country })

const CountryMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl, countryOptions }) => {

  const saveMatch = values => {
    const labelText = values.country.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({
      values,
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.country.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="country"
        component={Typeahead}
        multiple={true}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.country.input.placeholder" })}
        options={countryOptions}
        label={<FormattedMessage id="portal.configuration.traffic.rules.match.country" />}/>
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


CountryMatchForm.displayName = 'CountryMatchForm'
CountryMatchForm.propTypes = {
  countryOptions: PropTypes.array,
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

const stateToProps = (state, { initialValues }) => {

  const rules = formValueSelector('gtmForm')(state, 'rules') || []
  const existingOptions = []

  rules.forEach((rule => {

    rule.matchArray.forEach(match => {

      if (match.matchType === 'country') {

        existingOptions.push(...match.values.country.map(countryMatch => countryMatch.id))

      }
    })
  }))

  const countryOptions = countriesList.reduce((options, { id, label }) => {

    const initialValuesHasValue = initialValues.country.some((initialCountry) => initialCountry.id === id)
    if (!existingOptions.includes(id) || initialValuesHasValue) {

      options.push({ id, label })
    }

    return options
  }, [])

  return {
    countryOptions
  }
}

const Form = connect(stateToProps)(reduxForm({ form: 'country-traffic-match', validate })(injectIntl(CountryMatchForm)))
Form.defaultProps = { initialValues: { country: [] } }
export default Form
