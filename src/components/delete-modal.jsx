import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal, Input } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

let submitDisabled
const DeleteModal = ({ itemToDelete, onDelete, onCancel, fields: { delField } }) => {
  return (
    <Modal show={true} className="delete-modal">
      <Modal.Header  className="delete-modal-header">
        <h1>{`Delete ${ itemToDelete }`}</h1>
        <hr/>
      </Modal.Header>
      <Modal.Body className="delete-modal-body">
        <p>
          {`Please confirm by writing "delete" below, and pressing the delete button.
          This ${itemToDelete} will be removed immediately. This action can't be undone`}
        </p>
        <Input type="text" label="Type 'delete'" placeholder="Delete"{ ...delField }/>
      </Modal.Body>

      <Modal.Footer className="delete-modal-footer">
        <ButtonToolbar className="pull-right">
          <Button onClick={onCancel} className="btn-outline">Close</Button>
          <Button onClick={onDelete}
            bsStyle="primary"
            className="delete-modal-submit"
            disabled={submitDisabled}>
            Delete
          </Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  );
}

DeleteModal.displayName = 'ErrorModal'
DeleteModal.propTypes = {
  fields: PropTypes.object,
  itemToDelete: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func
}

export default reduxForm({
  fields: ['delField'],
  form: 'deleteModal',
  validate: ({ delField }) => {
    submitDisabled = !delField || delField.toLowerCase() !== 'delete'
  }
})(DeleteModal)

