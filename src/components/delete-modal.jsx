import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal, Input } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

import keyStrokeSupport from '../decorators/key-stroke-decorator'

import { FormattedMessage } from 'react-intl'

const DeleteModal = ({ itemToDelete, description, submit, cancel, fields: { delField }, invalid }) => {
  return (
    <Modal show={true} className="delete-modal">
      <Modal.Header  className="delete-modal-header">
        <h1><FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: itemToDelete}}/></h1>
        <hr/>
      </Modal.Header>
      <Modal.Body className="delete-modal-body">
        <p>
          {description || <FormattedMessage id="portal.deleteModal.warning.text" values={{itemToDelete : itemToDelete}}/>}
        </p>
        <Input type="text" label="Type 'delete'" placeholder="delete" {...delField}/>
      </Modal.Body>
      <Modal.Footer className="delete-modal-footer">
        <ButtonToolbar className="pull-right">
          <Button onClick={cancel}
            className="btn-secondary">
            <FormattedMessage id="portal.button.cancel"/>
          </Button>
          <Button onClick={submit}
            bsStyle="danger"
            disabled={invalid}>
            <FormattedMessage id="portal.button.delete"/>
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
