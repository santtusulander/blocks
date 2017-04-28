import React from 'react'
import { Modal } from 'react-bootstrap'
import classnames from 'classnames'
import IconClose from '../shared/icons/icon-close.jsx'

const ConfigurationSidebar = (props) => {
  return (
    <Modal
      show={true}
      dialogClassName="side-panel double-side-modal-container"
      onHide={props.onHide}
    >
      <div className={classnames('primary-side-modal', { disabled: props.rightColVisible })}>
        {props.children}
      </div>

      {props.rightColVisible &&
        <div className="modal-content secondary-side-modal">
          <a onClick={props.handleRightColClose} className="secondary-side-modal-close">
            <IconClose />
          </a>
          {props.rightColContent}
        </div>
      }

    </Modal>
  )
}

ConfigurationSidebar.displayName = 'ConfigurationSidebar'
ConfigurationSidebar.propTypes = {
  children: React.PropTypes.node,
  handleRightColClose: React.PropTypes.func,
  onHide: React.PropTypes.func,
  rightColContent: React.PropTypes.node,
  rightColVisible: React.PropTypes.bool
}

export default ConfigurationSidebar
