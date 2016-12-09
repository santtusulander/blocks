import React, { PropTypes } from 'react'
import { Checkbox as BSCheckbox } from 'react-bootstrap'

const Checkbox = (props) => (
  <BSCheckbox {...props}>
    <span>{props.label}</span>
  </BSCheckbox>
)

Checkbox.propTypes = {
  label: PropTypes.string
}

export default Checkbox
