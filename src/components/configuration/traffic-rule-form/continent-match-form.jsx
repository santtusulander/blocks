import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import continentsList from '../../../constants/continents'
import { checkForErrors } from '../../../util/helpers'

import Typeahead from '../../shared/form-fields/field-form-group-typeahead'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

const validate = ({ continent }) => checkForErrors({ continent })

const ContinentMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl, continentOptions }) => {

  const saveMatch = values => {
    const labelText = values.continent.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({
      values,
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.continent.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="continent"
        component={Typeahead}
        multiple={true}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.continent.input.placeholder" })}
        options={continentOptions}
        label={<FormattedMessage id="portal.configuration.traffic.rules.match.continent" />}/>
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

ContinentMatchForm.displayName = 'ContinentMatchForm'
ContinentMatchForm.propTypes = {
  continentOptions: PropTypes.array,
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

const stateToProps = (state, { intl, initialValues }) => {

  const rules = formValueSelector('gtmForm')(state, 'rules') || []
  const existingOptions = []

  //create an array of all existing conntinent matches
  rules.forEach((rule => {

    rule.matchArray.forEach(match => {

      if (match.matchType === 'continent') {

        existingOptions.push(...match.values.continent.map(continentMatch => continentMatch.id))

      }
    })
  }))

  //create available continent options, excluding those that already exist.
  const continentOptions = continentsList.reduce((options, continent) => {

    const isInInitialValues = initialValues.continent.some(({ id }) => id === continent.id)
    if (!existingOptions.includes(continent.id) || isInInitialValues) {

      options.push({
        id: continent.id,
        label: intl.formatMessage({ id: continent.labelId })
      })
    }

    return options
  }, [])

  return {
    continentOptions
  }
}

const Form = injectIntl(connect(stateToProps)(reduxForm({ form: 'continent-traffic-match', validate })(ContinentMatchForm)))
Form.defaultProps = { initialValues: { continent: [] } }
export default Form
