import React, { PropTypes } from 'react'
import { ButtonToolbar, Modal } from 'react-bootstrap'

import IconClose from './icons/icon-close.jsx'

class UDNModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { buttons, children, closeModal, show, showClose, title } = this.props

    return (
      <Modal show={show} dialogClassName="action-modal">
        <Modal.Header>
          <h1>{title}</h1>
        </Modal.Header>

        <Modal.Body>
          {children}
        </Modal.Body>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            {buttons}
          </ButtonToolbar>
        </Modal.Footer>
        {showClose
        ? <a onClick={closeModal} className="close-modal">
            <IconClose />
          </a>
        : null}
      </Modal>
    );
  }
}

UDNModal.displayName = 'UDNModal'
UDNModal.propTypes = {
  buttons: React.PropTypes.object,
  children: PropTypes.node,
  closeModal: PropTypes.func,
  show: PropTypes.bool,
  showClose: PropTypes.bool,
  title: PropTypes.string
}

export default UDNModal
