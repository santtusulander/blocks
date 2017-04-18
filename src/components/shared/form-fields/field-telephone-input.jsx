import React, { PropTypes } from 'react'
import ReactTelephoneInput from 'react-telephone-input'
import classNames from 'classnames'
import { FormGroup, ControlLabel } from 'react-bootstrap'

import DefaultErrorBlock from '../form-elements/default-error-block'

import { stripCountryCode, stripNonNumeric } from '../../../util/user-helpers'

const FieldTelephoneInput = ({ full_phone_number, phone_number, phone_country_code, label, required, ErrorComponent, disabled}) => {
  return (
    <FormGroup controlId={full_phone_number.input.name} validationState={full_phone_number.meta.error ? 'error' : null}>
      {label && <ControlLabel>{label}{required && ' *'}</ControlLabel>}
      <ReactTelephoneInput
        value={full_phone_number.input.value}
        onChange={(val, {dialCode}) => {
          const phoneNumber = stripNonNumeric(stripCountryCode(val, dialCode))

          full_phone_number.input.onChange(`${stripNonNumeric(val)}`)
          stripNonNumeric(val) &&
          stripNonNumeric(val).substring(0, dialCode.length) === dialCode
            ? phone_country_code.input.onChange(dialCode)
            : phone_country_code.input.onChange('')
          phone_number.input.onChange(phoneNumber)
        }}
        classNames={classNames(
          {empty: !phone_country_code.input.value}
        )}
        defaultCountry="us"
        disabled={disabled}
      />

      {full_phone_number.meta.error &&
        <ErrorComponent {...full_phone_number.meta}/>
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
  full_phone_number: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  phone_country_code: PropTypes.object,
  phone_number: PropTypes.object,
  required: PropTypes.bool
}

export default FieldTelephoneInput
