import React from 'react'
import Immutable from 'immutable'
import {reduxForm} from 'redux-form'

import { Modal, Input, ButtonToolbar, Button, Table } from 'react-bootstrap'

import CheckboxArray from '../checkboxes'
import PermissionSelection from '../permission-selection'

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
    value: props.editRole.get('parentRoles'),
    onChange: () => null
  }
  // TODO: Fix this when API returns permission options
  const editPerms = Immutable.Map([
    ...props.editRole.get('permissions').get('aaa'),
    ...props.editRole.get('permissions').get('north')
  ])

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

        {/*TODO: Enable in the future when roles are editable, after 0.8
        <label>Role Available To</label>

        <CheckboxArray
          iterable={rolesArray}
          field={field}
          inline={true}
          disabled={true}/>

        <hr/>
        */}

        <label>Permissions</label>

        <Table className="table-striped">
          <thead>
            <tr>
              <th colSpan="3">PERMISSION</th>
            </tr>
          </thead>
          <tbody>
            {editPerms.map((permissions, i) => {
              return (
                <tr key={i}>
                  <td className="no-border">
                    {i}
                  </td>
                  <td>
                    {/*TODO: Remove disabled prop in the future when roles are editable*/}
                    <PermissionSelection
                      className="pull-right"
                      onChange={() => null}
                      disabled={true}
                      permissions={permissions}/>
                  </td>
                </tr>
              )
            }).toList()}
          </tbody>
        </Table>

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
