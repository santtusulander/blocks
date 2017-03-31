import React from 'react'
import { Modal } from 'react-bootstrap'
import IconClose from '../icons/icon-close.jsx'

class ConfigurationSidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let className = 'configuration-sidebar'
    if (this.props.rightColVisible) {
      className = className + ' ' + 'right-col-visible'
    }
    return (
      <Modal show={true}
        dialogClassName={className}
        onHide={this.props.onHide}>
        {this.props.children}
        {this.props.rightColVisible ?
          <div className="sidebar-right-col">
            <a className="sidebar-right-col-close btn-icon"
              onClick={this.props.handleRightColClose}>
              <IconClose width={20} height={20}/>
            </a>
            {this.props.rightColContent}
          </div>
        : ''}
      </Modal>
    )
  }
}

ConfigurationSidebar.displayName = 'ConfigurationSidebar'
ConfigurationSidebar.propTypes = {
  children: React.PropTypes.node,
  handleRightColClose: React.PropTypes.func,
  onHide: React.PropTypes.func,
  rightColContent: React.PropTypes.node,
  rightColVisible: React.PropTypes.bool
}

module.exports = ConfigurationSidebar
