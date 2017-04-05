import React, { PropTypes } from 'react'

import PasswordFields from '../../password-fields'

const FieldPasswordFields = ({ input, ...rest }) => {

  return (
    <PasswordFields
      {...input}
      inlinePassword={true}
      changePassword={(valid) => {
        rest.validCallBack(valid)
        //input.onChange({ val: input.value.val, valid: valid})
      }}
    />
  )
}

FieldPasswordFields.displayName = 'FieldPasswordFields'
FieldPasswordFields.propTypes = {
  input: PropTypes.object
}

export default FieldPasswordFields
