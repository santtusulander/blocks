import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import continents from '../../../constants/continents'
import { checkForErrors } from '../../../util/helpers'

import Typeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = ({ continents = [] }) => checkForErrors({ continents })

export default reduxForm({ form: 'continents-traffic-match', validate })(({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid }) => {

  const saveMatch = values => {
    const labelText = values.continents.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({ values, label: `Continents: ${labelText}`, matchType }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="continents"
        component={Typeahead}
        placeholder={"Enter continent name"}
        multiple={true}
        options={continents}
        label="Continent"/>
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
