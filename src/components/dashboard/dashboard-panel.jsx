import React, { PropTypes } from 'react'
import classNames from 'classnames'

import './dashboard-panel.scss'

const DashboardPanel = (props) => {
  const { children, className, noPadding, title } = props
  return (
    <div className={classNames(
      'dashboard-panel',
      {
        className,
        'no-padding': noPadding
      }
    )}>
      {title &&
        <div className="dashboard-panel-header">
          <h5>{title}</h5>
        </div>
      }
      <div className="dashboard-panel-content">
        {children}
      </div>
    </div>
  )
}

DashboardPanel.displayName = "DashboardPanel"
DashboardPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
  title: PropTypes.string
}

export default DashboardPanel
