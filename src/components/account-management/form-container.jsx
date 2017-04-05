import React from 'react'
import { Modal } from 'react-bootstrap'

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

AccountManagementFormContainer.displayName = "AccountManagementFormContainer"
AccountManagementFormContainer.propTypes = {
  children: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  show: React.PropTypes.bool,
  subtitle: React.PropTypes.string,
  title: React.PropTypes.string
}
