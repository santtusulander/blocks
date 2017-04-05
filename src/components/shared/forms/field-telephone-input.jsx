import React, { PropTypes } from 'react'
import ReactTelephoneInput from 'react-telephone-input'
import { FormGroup, ControlLabel } from 'react-bootstrap';

import DefaultErrorBlock from './default-error-block'

import { stripCountryCode, stripNonNumeric } from '../../../util/user-helpers'

const FieldTelephoneInput = ({ input, meta, label, required, disabled, ErrorComponent }) => {
  return (
    <FormGroup controlId={input.name} validationState={meta.error ? 'error' : null}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}
      <ReactTelephoneInput
        value={`+${input.value.phone_country_code} ${input.value.phone_number}`}
        onChange={(val, {dialCode}) => {

          const countryCode = dialCode
          const phoneNumber = stripNonNumeric(stripCountryCode(val, countryCode))

          input.onChange({phone_number: phoneNumber, phone_country_code: countryCode})
        }}
        defaultCountry="us"
        disabled={disabled}
      />

      {meta.error &&
        <ErrorComponent {...meta}/>
      }
    </FormGroup>
  )
}

FieldTelephoneInput.displayName = 'FieldTelephoneInput'

FieldTelephoneInput.defaultProps = {
  ErrorComponent: DefaultErrorBlock,
  required: true
}


FieldTelephoneInput.propTypes = {
  ErrorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  disabled: PropTypes.bool,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.object
  }),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  required: PropTypes.bool
}

export default FieldTelephoneInput
