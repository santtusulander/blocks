import React, { PropTypes } from 'react'
import { ButtonToolbar, Modal } from 'react-bootstrap'

const InfoModal = ({ title, content, children }) =>
  <Modal show={true} className="error-modal">
    <Modal.Header className="login-header">
      <div className="logo-ericsson">Ericsson</div>
      <h1>{title}</h1>
      <div className="login-header-gradient"></div>
    </Modal.Header>
    <Modal.Body>
      <p>{content}</p>
    </Modal.Body>
    <Modal.Footer>
      <ButtonToolbar className="pull-right">
        {children}
      </ButtonToolbar>
    </Modal.Footer>
  </Modal>

InfoModal.propTypes = {
  children: PropTypes.array,
  content: PropTypes.string,
  title: PropTypes.string
}

export default InfoModal
