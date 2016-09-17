import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import IconClose from './icons/icon-close.jsx'

class UDNModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, cancelButton, closeButton, closeModal, deleteButton, show, title } = this.props

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
            {closeButton &&
            <Button
              className="btn-primary"
              onClick={closeButton}>
              <FormattedMessage id="portal.button.close"/>
            </Button>}

            {cancelButton &&
            <Button
              className="btn-secondary"
              onClick={cancelButton}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>}

            {deleteButton&&
            <Button
              bsStyle="danger"
              onClick={deleteButton}>
              <FormattedMessage id="portal.button.delete"/>
            </Button>}
          </ButtonToolbar>
        </Modal.Footer>

        {closeModal &&
        <a
          className="close-modal"
          onClick={closeModal}>
          <IconClose />
        </a>}
      </Modal>
    );
  }
}

UDNModal.displayName = 'UDNModal'
UDNModal.propTypes = {
  buttons: React.PropTypes.object,
  cancelButton: PropTypes.func,
  children: PropTypes.node,
  closeButton: PropTypes.func,
  closeModal: PropTypes.func,
  deleteButton: PropTypes.func,
  show: PropTypes.bool,
  showClose: PropTypes.bool,
  title: PropTypes.string
}

export default UDNModal
