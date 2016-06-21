import React from 'react'
import { Modal } from 'react-bootstrap'
import './add-account-form.scss'
const AccountManagementFormContainer = (props) => {

  return (
    <Modal show={props.show}
           onHide={props.onCancel}
           dialogClassName="modal-form-panel">

      <Modal.Header>
        <h1>{props.title}</h1>
        <p>{props.subtitle}</p>
      </Modal.Header>

      <Modal.Body>
        {props.children}
      </Modal.Body>

    </Modal>
  )
}

module.exports = AccountManagementFormContainer

AccountManagementFormContainer.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  show: React.PropTypes.bool
}
