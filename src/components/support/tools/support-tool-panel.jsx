import React from 'react'
import classNames from 'classnames'

const SupportToolPanel = ({ active, body, className, icon, onClick, title }) => {
  return (
    <div
      className={classNames(
        'support-tool-panel text-center',
        {'active': active},
        className
      )}
      onClick={onClick}>
      {icon}
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}

SupportToolPanel.displayName = 'SupportToolPanel'
SupportToolPanel.propTypes = {
  active: React.PropTypes.bool,
  body: React.PropTypes.string,
  className: React.PropTypes.string,
  icon: React.PropTypes.node,
  onClick: React.PropTypes.func,
  title: React.PropTypes.string
}

export default SupportToolPanel
