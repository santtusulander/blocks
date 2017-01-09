import React, { PropTypes } from 'react'

import PasswordFields from '../password-fields'

const FieldPasswordFields = ({input, meta, ...rest}) => {

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

export default FieldPasswordFields
