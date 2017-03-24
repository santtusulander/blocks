import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import { checkForErrors } from '../../../util/helpers'

import ASNTypeahead from '../../form/field-form-group-asn-lookup'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = ({ AsnLookup = [] }) => checkForErrors({ AsnLookup })

const ASNMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid }) => {

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

ASNMatchForm.displayName = 'ASNMatchForm'
ASNMatchForm.propTypes = {
  handleSubmit: PropTypes.func,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({ form: 'asn-traffic-match', validate })(ASNMatchForm)
