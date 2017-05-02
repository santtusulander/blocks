import React from 'react'
import IconClose from '../../shared/icons/icon-close.jsx'

const Notification = (props) => {
  let className = 'notification-panel'
  if (props.className) {
    className += ' ' + props.className
  }

  return (
    <div className={className}>
      {props.children}

      <a className="notification-close btn-icon" onClick={props.handleClose}>
        <IconClose width={30} height={30} />
      </a>
    </div>
  )
}

Notification.displayName = 'Notification'
Notification.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  handleClose: React.PropTypes.func
}

export default Notification
