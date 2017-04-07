import React from 'react'
import { Modal } from 'react-bootstrap'
import classnames from 'classnames'
import IconClose from '../shared/icons/icon-close.jsx'

class ConfigurationSidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { rightColVisible, handleRightColClose } = this.props

    return (
      <Modal
        show={true}
        dialogClassName="side-panel double-side-modal-container"
        onHide={this.props.onHide}
      >
        <div className={classnames('primary-side-modal', { disabled: rightColVisible })}>
          {this.props.children}
        </div>
        {rightColVisible &&
          <div className="modal-content secondary-side-modal">
            <a onClick={handleRightColClose} className="secondary-side-modal-close">
              <IconClose />
            </a>
            {this.props.rightColContent}
          </div>
        }
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
