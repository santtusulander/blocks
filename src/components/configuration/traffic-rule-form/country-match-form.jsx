import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import countries from '../../../constants/country-list'

import Typeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = ({ countries = [] }) => !countries.length && { countries: 'Required.' }

export default reduxForm({ form: 'countries-traffic-match', validate })(({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid }) => {

  const saveMatch = values => {
    const labelText = values.countries.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({ values, label: `Countries: ${labelText}`, matchType }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="countries"
        component={Typeahead}
        placeholder={"Entry contry name, or 2 letter code ISO code"}
        multiple={true}
        options={countries}
        label="Country"/>
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
})
