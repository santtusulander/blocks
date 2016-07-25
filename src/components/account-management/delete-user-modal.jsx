import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

const DeleteUserModal = ({ itemToDelete, onDelete, onCancel }) =>
    <Modal show={true} className="delete-modal">
      <Modal.Header  className="delete-modal-header">
        <h1>Delete User?</h1>
      </Modal.Header>
      <Modal.Body className="delete-modal-body">
        <h3>
          {itemToDelete}<br/>
        </h3>
        <p>
          Will lose access to UDN immediately and will not be able to log in anymore.
        </p>
      </Modal.Body>

      <Modal.Footer className="delete-modal-footer">
        <ButtonToolbar className="pull-right">
          <Button onClick={onCancel} className="btn-outline">Cancel</Button>
          <Button onClick={onDelete}
                  bsStyle="secondary"
                  className="delete-modal-submit delete-user-submit">
            Delete
          </Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>

DeleteUserModal.propTypes = {
  fields: PropTypes.object,
  itemToDelete: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func
}

export default DeleteUserModal

