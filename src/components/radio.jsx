import React, { PropTypes } from 'react'
import { Radio as BSRadio } from 'react-bootstrap'

/* eslint-disable no-unused-vars */
const Radio = ({children, input, meta, ...otherProps}) => (
  <BSRadio
    {...input}
    {...otherProps}>
    <span>{children}</span>
  </BSRadio>
)

Radio.displayName = "Radio"
Radio.propTypes = {
  children: PropTypes.node,
  input: PropTypes.object,
  meta: PropTypes.object
}

export default Radio
