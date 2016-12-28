import React, { PropTypes } from 'react'
import { Checkbox as BSCheckbox } from 'react-bootstrap'

const Checkbox = (props) => (
  <BSCheckbox {...props}>
    <span>{props.children}</span>
  </BSCheckbox>
)

Checkbox.displayName = "Checkbox"
Checkbox.propTypes = {
  children: PropTypes.node
}

export default Checkbox
