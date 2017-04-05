import React, { PropTypes } from 'react'
import classNames from 'classnames'

const DashboardPanels = (props) => {
  const { children, className } = props
  return (
    <div className={classNames(
      'dashboard-panels', { className }
    )}>
      {children}
    </div>
  )
}

DashboardPanels.displayName = "DashboardPanels"
DashboardPanels.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default DashboardPanels
