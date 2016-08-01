import React from 'react'
import Immutable from 'immutable'

import { AccountManagementHeader } from './account-management-header.jsx'
import RolesEditForm from './role-edit-form.jsx'
import ActionLinks from './action-links.jsx'

import ArrayTd from '../array-td/array-td'

import './roles-list.scss';

function labelPermissions(rolePermissions, permissions, section) {
  let permissionNames = rolePermissions
    .map((rules, key) => {
      let permissionName = permissions
        .find(permission => permission.get('name') === key)
        .get('title')
      return `${section}: ${permissionName} (${key})`
    })
  return permissionNames;
}

export const RolesList = props => {

  if (!props.roles || props.roles.size === 0) {
    return (
      <div id="empty-msg">
        <p>No roles found</p>
      </div>
    )
  }

  return (
    <div className='roles-list'>

      <AccountManagementHeader
        title={`${props.roles.count() } Roles`}/>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
            <th>Assigned To</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {props.roles.map( (role, i) => {
            return (
              <tr className='roles-list-row' key={i}>
                <td>
                  {role.get('name')}
                </td>
                <ArrayTd items={[
                  ...labelPermissions(
                    role.get('permissions').get('aaa'),
                    props.permissions.get('aaa'),
                    'AAA'
                  ).toArray(),
                  ...labelPermissions(
                    role.get('permissions').get('north'),
                    props.permissions.get('north'),
                    'North'
                  ).toArray(),
                  ...labelPermissions(
                    role.get('permissions').get('ui'),
                    props.permissions.get('ui'),
                    'UI'
                  ).toArray()
                ]} />
                <td>
                  {props.users
                    .filter(user => user.get('roles').contains(role.get('id')))
                    .size
                  }
                </td>
                <td>
                  <ActionLinks
                    onEdit={() => props.onEdit(role.get('id'))}
                    onDelete={() => props.onDelete(role.get('id'))}/>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>

      {props.showAddNewDialog ?
        <RolesEditForm
          permissions={props.permissions}
          roles={props.roles}
          editRole={props.editRole}
          show={props.showAddNewDialog}
          onCancel={props.onCancel}
          onSave={props.onSave}/>
      : null}

    </div>
  )
}
RolesList.propTypes = {
  editRole: React.PropTypes.object,
  onAdd: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onSave: React.PropTypes.func,
  permissions: React.PropTypes.instanceOf(Immutable.Map),
  roles: React.PropTypes.instanceOf(Immutable.List),
  showAddNewDialog: React.PropTypes.bool,
  users: React.PropTypes.instanceOf(Immutable.List)
}
RolesList.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.List(),
  users: Immutable.List()
}

export default RolesList
