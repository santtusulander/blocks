import React from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'

const RolesAddNew = (props) => {

  return (
    <Modal
      show={props.show}
      onHide={props.onCancel}
      dialogClassName="roles-add-new"
    >

      <Modal.Header>
        <h1>Add New Role</h1>
      </Modal.Header>

      <Modal.Body>
        <Input type='text' label='Role name' />

        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
          <Button bsStyle="primary" onClick={props.onSave}>Save</Button>
        </ButtonToolbar>

      </Modal.Body>

    </Modal>
  )
}

RolesAddNew.propTypes = {
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  show: React.PropTypes.bool
}

export default RolesAddNew
