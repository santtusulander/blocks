import React, { PropTypes } from 'react'

const ToggleElement = ({ toggle, children }) =>
  <div className="selector-component__toggle" onClick={toggle}>{children}</div>

ToggleElement.displayName = 'ToggleElement'
ToggleElement.propTypes = {
  children: PropTypes.object,
  toggle: PropTypes.func
}

export default ToggleElement
