import React from 'react'

import './support-tool-panel.scss'

class SupportToolPanel extends React.Component {
  render() {
    const {active, body, className, icon, onClick, title} = this.props
    let classNames = 'support-tool-panel text-center'
    if(className) {
      classNames += className
    }
    if(active === this) {
      classNames += ' active'
    }
    return (
      <div
        className={classNames}
        onClick={() => {onClick(this)}}>
        {icon}
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    )
  }
}

SupportToolPanel.displayName = 'SupportToolPanel'
SupportToolPanel.propTypes = {
  active: React.PropTypes.object,
  body: React.PropTypes.string,
  className: React.PropTypes.string,
  icon: React.PropTypes.node,
  onClick: React.PropTypes.func,
  title: React.PropTypes.string
}

export default SupportToolPanel
