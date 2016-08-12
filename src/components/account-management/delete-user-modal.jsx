import React, { PropTypes, Component } from 'react'
import { once } from 'underscore'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

export default class DeleteUserModal extends Component {
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
      case 13: this.deleteOnce()
        break
      case 27: this.cancelOnce()
        break
    }
  }

  render() {
    const { itemToDelete, onDelete, onCancel } = this.props
    return (
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
                    type="submit"
                    bsStyle="secondary"
                    className="delete-modal-submit delete-user-submit">
              Delete
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    )
  }
}

DeleteUserModal.propTypes = {
  fields: PropTypes.object,
  itemToDelete: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func
}
