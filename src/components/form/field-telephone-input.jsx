import React, { PropTypes } from 'react'
import ReactTelephoneInput from 'react-telephone-input'
import { FormGroup } from 'react-bootstrap';

import DefaultErrorBlock from './default-error-block'

import { getReduxFormValidationState } from '../../util/helpers'
import { stripCountryCode, stripNonNumeric } from '../../util/user-helpers'

const FieldTelephoneInput = ({ input, meta, ErrorComponent }) => {
  return (
    <FormGroup controlId={input.name} validationState={getReduxFormValidationState(meta)}>
      <ReactTelephoneInput
        initialValue={`+${input.value.phone_country_code} ${input.value.phone_number}`}
        onChange={(val, {dialCode})=> {

          const countryCode = dialCode
          const phoneNumber = stripNonNumeric( stripCountryCode( val, countryCode ) )

          input.onChange({phone_number: phoneNumber, phone_country_code: countryCode})
        }}
        defaultCountry="us"
      />

      {meta.error &&
        <ErrorComponent {...meta}/>}

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
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.object
  }),
  meta: PropTypes.object
}

export default FieldTelephoneInput
