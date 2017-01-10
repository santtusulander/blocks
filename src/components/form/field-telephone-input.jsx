import React, { PropTypes } from 'react'
import ReactTelephoneInput from 'react-telephone-input'
import { FormattedMessage } from 'react-intl'

const FieldTelephoneInput = ({ input, label }) => {
  return (
    <div>
      {label && <label className="control-label"><FormattedMessage id="portal.user.edit.phoneNumber.text"/></label>}

      <ReactTelephoneInput
        value={input.value.val}
        onChange={(val, {dialCode})=> {
          input.onChange({val, dialCode})
        }}
        defaultCountry="us"
      />
    </div>
  )
}

FieldTelephoneInput.displayName = 'FieldTelephoneInput'
FieldTelephoneInput.propTypes = {
  label: PropTypes.object,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.object
  })
}

export default FieldTelephoneInput
