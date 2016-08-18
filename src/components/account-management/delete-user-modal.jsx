import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

import keyStrokeSupport from '../../decorators/key-stroke-decorator'

const DeleteUserModal = ({ itemToDelete, submit, cancel }) =>
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
        <Button onClick={cancel} className="btn-outline">Cancel</Button>
        <Button onClick={submit}
                type="submit"
                bsStyle="secondary"
                className="delete-modal-submit delete-user-submit">
          Delete
        </Button>
      </ButtonToolbar>
    </Modal.Footer>
  </Modal>

DeleteUserModal.propTypes = {
  cancel: PropTypes.func,
  fields: PropTypes.object,
  itemToDelete: PropTypes.string,
  submit: PropTypes.func
}

export default keyStrokeSupport(DeleteUserModal)
