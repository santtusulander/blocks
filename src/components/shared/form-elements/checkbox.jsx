import React, { PropTypes } from 'react'
import { Checkbox as BSCheckbox } from 'react-bootstrap'

const Checkbox = (props) => (
  <BSCheckbox {...props}>
    <span>
      <div className="menu-item-label"> {props.children} </div>
    </span>
  </BSCheckbox>
)

Checkbox.displayName = "Checkbox"
Checkbox.propTypes = {
  children: PropTypes.node
}

export default Checkbox
