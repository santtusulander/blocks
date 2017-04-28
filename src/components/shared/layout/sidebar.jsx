import React from 'react'

const Sidebar = (props) => {
  let className = 'sidebar-layout'
  if (props.className) {
    className = className + ' ' + props.className;
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

Sidebar.displayName = 'Sidebar'
Sidebar.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
}

export default Sidebar
