import React from 'react'
import {reduxForm} from 'redux-form'

import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'

import './role-edit-form.scss'

let errors = {}

const validate = values => {
  errors = {}

  const { roleName } = values

  if (!roleName || roleName.length === 0) errors.roleName = 'roleName is required'

  return errors;
}

const RolesEditForm = (props) => {

  const { fields: { roleName } } = props

  return (
    <Modal
      show={props.show}
      onHide={props.onCancel}
      dialogClassName="role-edit-form-sidebar"
    >

      <Modal.Header>
        <h1>Add New Role</h1>
      </Modal.Header>

      <Modal.Body>
        <Input
          { ...roleName }
          type='text'
          placeholder='Enter Role Name'
          label='Role name'
        />

        {roleName.touched && roleName.error && <div className='error-msg'>{roleName.error}</div>}

        <hr/>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={props.onCancel}>Cancel</Button>
          <Button bsStyle="primary" disabled={ Object.keys(errors).length !== 0 } onClick={props.onSave}>Save</Button>
        </ButtonToolbar>

      </Modal.Body>

    </Modal>
  )
}

RolesEditForm.propTypes = {
  fields: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  show: React.PropTypes.bool
}

export default reduxForm({
  fields: ['roleName'],
  form: 'role-edit',
  validate
})(RolesEditForm)
