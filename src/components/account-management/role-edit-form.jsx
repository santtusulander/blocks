import React from 'react'
import Immutable from 'immutable'
import {reduxForm} from 'redux-form'

import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'

import CheckboxArray from '../checkboxes'
import Toggle from '../toggle'

import './role-edit-form.scss'

let errors = {}

let formActivated = false

const validate = values => {
  errors = {}

  const { roleName } = values

  if (!roleName || roleName.length === 0) {
    errors.roleName = 'Role name is required'
  }

  return errors;
}

const RolesEditForm = (props) => {

  const { fields: { roleName } } = props

  const rolesArray = props.roles.map((role) => {
    return {
      value: role.get('id'),
      label: role.get('name')
    }
  }).toArray()

  const field = {
    value: props.editRole.get('parentRoles')
  }

  return (
    <Modal
      show={props.show}
      dialogClassName="role-edit-form-sidebar">

      <Modal.Header>
        <h1>Edit Role</h1>
        <p>Lorem ipsum</p>
      </Modal.Header>

      <Modal.Body>

        {/*TODO: Enable in the future when roles are editable*/}
        <Input
          {...roleName}
          type='text'
          placeholder='Enter Role Name'
          label='Name'
          value={props.editRole.get('name')}
          readOnly={true}
        />

        {roleName.touched && roleName.error && <div className='error-msg'>{roleName.error}</div>}

        <hr/>

        <label>Role Available To</label>

        {/*TODO: Enable in the future when roles are editable*/}
        <CheckboxArray
          iterable={rolesArray}
          field={field}
          inline={true}
          disabled={true}/>

        <hr/>

        <label>Permissions</label>

        {props.permissions.map((permission, i) => {
          const selected = props.editRole.get('permissions').includes(permission.get('id'))
          let rowClasses = "toggle-row clearfix"
          if(selected) {
            rowClasses += ' on'
          }
          return (
            <div className={rowClasses} key={i}>
              <span className="toggle-row-label">{permission.get('name')}</span>
              {/*TODO: Enable in the future when roles are editable*/}
              <Toggle
                className="pull-right"
                changeValue={() => null}
                value={selected}
                readonly={true}/>
            </div>
          )
        })}

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline"
            onClick={props.onCancel}>
            Cancel
          </Button>
          <Button bsStyle="primary"
            disabled={Object.keys(errors).length !== 0 || !formActivated}
            onClick={props.onSave}>
            Save
          </Button>
        </ButtonToolbar>

      </Modal.Body>

    </Modal>
  )
}

RolesEditForm.propTypes = {
  editRole: React.PropTypes.object,
  fields: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  permissions: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.object,
  show: React.PropTypes.bool
}

export default reduxForm({
  fields: ['roleName', 'roles', 'roleTypes'],
  form: 'role-edit',
  validate
})(RolesEditForm)
