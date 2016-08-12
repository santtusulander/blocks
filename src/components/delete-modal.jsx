import React, { PropTypes, Component } from 'react'
import { once } from 'underscore'
import { Button, ButtonToolbar, Modal, Input } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

let submitDisabled
export default class DeleteModal extends Component {
  constructor(props) {
    super(props)
    this.deleteOnce = once(props.onDelete)
    this.cancelOnce = once(props.onCancel)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown({ keyCode }) {
    switch(keyCode) {
      case 13: !submitDisabled && this.deleteOnce()
        break
      case 27: this.cancelOnce()
        break
    }
  }
  render() {
    const { itemToDelete, description, onDelete, onCancel, fields: { delField } } = this.props
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
            <Button onClick={onCancel} className="btn-outline">Cancel</Button>
            <Button onClick={onDelete}
              bsStyle="secondary"
              className="delete-modal-submit"
              disabled={submitDisabled}>
              Delete
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    )
  }
}

DeleteModal.propTypes = {
  description: PropTypes.string,
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

