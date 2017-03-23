import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import ASNTypeahead from '../../form/field-form-group-asn-lookup'
import FormFooterButtons from '../../form/form-footer-buttons'

export default reduxForm({ form: 'asn-traffic-match' })(({ onSave, onCancel, matchIndex, matchType, handleSubmit }) => {

  const saveMatch = values => {
    const labelText = values.AsnLookup.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({ values, label: `ASN: ${labelText}`, matchType }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <ASNTypeahead/>
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
            bsStyle="primary">
            {typeof matchIndex === 'number'
              ? <FormattedMessage id='portal.common.button.save' />
              : <FormattedMessage id='portal.common.button.add' />}
          </Button>
        </FormFooterButtons>
    </form>
  )
})
