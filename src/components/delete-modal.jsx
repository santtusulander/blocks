import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal, Input } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

import keyStrokeSupport from '../decorators/key-stroke-decorator'

const DeleteModal = ({ itemToDelete, description, submit, cancel, fields: { delField }, invalid }) => {
  const defaultDescription = `Please confirm by writing "delete" below, and pressing the delete button.
        This ${itemToDelete} will be removed immediately. This action can't be undone`;
  return (
    <Modal show={true} className="delete-modal">
      <Modal.Header  className="delete-modal-header">
        <h1>{`Delete ${ itemToDelete }`}</h1>
        <hr/>
      </Modal.Header>
      <Modal.Body className="delete-modal-body">
        <p>
          {description || defaultDescription}
        </p>
        <Input type="text" label="Type 'delete'" placeholder="delete" {...delField}/>
      </Modal.Body>
      <Modal.Footer className="delete-modal-footer">
        <ButtonToolbar className="pull-right">
          <Button onClick={cancel} className="btn-outline">Cancel</Button>
          <Button onClick={submit}
            bsStyle="secondary"
            className="delete-modal-submit"
            disabled={invalid}>
            Delete
          </Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  )
}

DeleteModal.propTypes = {
  cancel: PropTypes.func,
  description: PropTypes.string,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  itemToDelete: PropTypes.string,
  submit: PropTypes.func
}

export default reduxForm({
  fields: ['delField'],
  form: 'deleteModal',
  validate: ({ delField }) => {
    if (!delField || delField.toLowerCase() !== 'delete') {
      return { delField: true }
    }
  }
})(keyStrokeSupport(DeleteModal))

