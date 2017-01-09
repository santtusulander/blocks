import React, { PropTypes } from 'react'
import ReactTelephoneInput from 'react-telephone-input'

const FieldTelephoneInput = ({ input }) => {
  return (
    <ReactTelephoneInput
      value={input.value.val}
      onChange={(val, {dialCode})=> {
        input.onChange({val, dialCode})
      }}
      defaultCountry="us"
    />
  )
}

FieldTelephoneInput.displayName = 'FieldTelephoneInput'
FieldTelephoneInput.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.object
  })
}

export default FieldTelephoneInput
