import React, { PropTypes } from 'react'
import classNames from 'classnames'

const DashboardPanel = (props) => {
  const { children, className, contentClassName, noPadding, title } = props
  return (
    <div className={classNames(
      'dashboard-panel',
      className,
      { 'no-padding': noPadding }
    )}>
      {title &&
        <div className="dashboard-panel-header">
          <h5>{title}</h5>
        </div>
      }
      <div className={classNames("dashboard-panel-content", contentClassName)}>
        {children}
      </div>
    </div>
  )
}

DashboardPanel.displayName = "DashboardPanel"
DashboardPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  noPadding: PropTypes.bool,
  title: PropTypes.string
}

export default DashboardPanel
