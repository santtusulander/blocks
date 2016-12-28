import React, { PropTypes } from 'react'
import { Radio as BSRadio } from 'react-bootstrap'

const Radio = (props) => (
  <BSRadio {...props}>
    <span>{props.children}</span>
  </BSRadio>
)

Radio.displayName = "Radio"
Radio.propTypes = {
  children: PropTypes.node
}

export default Radio
