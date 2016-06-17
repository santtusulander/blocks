import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal, Input } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

let submitDisabled
const DeleteModal = ({ itemToDelete, onDelete, onCancel, fields: { delField } }) => {
  return (
    <Modal show={true} className="error-modal">
      <Modal.Header className="">
        <h1>{`Delete ${ itemToDelete }`}</h1>
        <hr/>
        <div className="login-header-gradient"></div>
      </Modal.Header>
      <Modal.Body>
        <p>
          {`Please confirm by writing "delete" below, and pressing the delete button.
          This ${itemToDelete} will be removed immediately. This action can't be undone`}
        </p>
        <Input type="text" label="Type 'delete'" placeholder="Delete"{ ...delField }/>
      </Modal.Body>

      <Modal.Footer>
        <ButtonToolbar className="pull-right">
          <Button onClick={onCancel} bsStyle="primary">Close</Button>
          <Button onClick={onDelete} bsStyle="primary" disabled={submitDisabled}>Delete</Button>
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
  validate: ({ delField }) => submitDisabled = delField !== 'delete' && delField !== 'Delete' ? true : false
})(DeleteModal)

