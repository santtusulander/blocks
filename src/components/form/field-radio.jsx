import React, { PropTypes } from 'react';
import { Radio } from 'react-bootstrap';

import Select from '../select.jsx'
import { getReduxFormValidationState } from '../../util/helpers'

const FieldRadio  = ({ input, disabled, meta: { touched, error }, label }) => {
  return (
    <Radio
      {...input}
      >
      {label}
    </Radio>
  )
}

export default FieldRadio
