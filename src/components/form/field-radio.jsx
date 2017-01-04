import React, { PropTypes } from 'react';
import { Radio } from 'react-bootstrap';

const FieldRadio  = ({ input, disabled, label }) => {
  return (
    <Radio
      {...input}
      disabled={disabled}
      >
      {label}
    </Radio>
  )
}

FieldRadio.displayName = 'FieldRadio'

FieldRadio.propTypes = {
  disabled: PropTypes.bool,
  input: PropTypes.obj,
  label: PropTypes.obj
}

export default FieldRadio
