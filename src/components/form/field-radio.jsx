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
  input: PropTypes.object,
  label: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ])
}

export default FieldRadio
