import React, { PropTypes } from 'react'
import { Radio as BSRadio } from 'react-bootstrap'

const Radio = ({children, input, ...otherProps}) => (
  <BSRadio
    {...input}
    {...otherProps}>
    <span>{children}</span>
  </BSRadio>
)

Radio.propTypes = {
  children: PropTypes.node,
  input: PropTypes.object
}

export default Radio
