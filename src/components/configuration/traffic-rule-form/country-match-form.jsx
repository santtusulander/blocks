import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import countriesList from '../../../constants/country-list'
import { checkForErrors } from '../../../util/helpers'

import Typeahead from '../../shared/form-fields/field-form-group-typeahead'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

const validate = ({ countries }) => checkForErrors({ countries })

const CountryMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl }) => {

  const saveMatch = values => {
    const labelText = values.countries.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
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
        name="countries"
        component={Typeahead}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.country.input.placeholder" })}
        multiple={true}
        options={countriesList}
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
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

const Form = reduxForm({ form: 'countries-traffic-match', validate })(injectIntl(CountryMatchForm))
Form.defaultProps = { initialValues: { countries: [] } }
export default Form
