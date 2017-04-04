import React from 'react'
import IconClose from '../components/shared/icons/icon-close.jsx'

class Notification extends React.Component {
  render() {
    let className = 'notification-panel'
    if (this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <div className={className}>
        {this.props.children}
        <a className="notification-close btn-icon"
          onClick={this.props.handleClose}>
          <IconClose
            width={30}
            height={30}
          />
        </a>
      </div>
    );
  }
}

Notification.displayName = 'Notification'
Notification.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  handleClose: React.PropTypes.func
}

export default Notification
