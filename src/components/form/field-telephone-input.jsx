import React, { PropTypes } from 'react'

import ReactTelephoneInput from 'react-telephone-input'

const FieldTelephoneInput = (field) => {
  return (
    <ReactTelephoneInput
      value={field.input.value.val}
      onChange={(val, {dialCode})=> {
        field.input.onChange({val, dialCode})

        //input.onChange(val)
      }}
      defaultCountry="us"
    />
  )
}

export default FieldTelephoneInput
