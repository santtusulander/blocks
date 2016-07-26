import React from 'react'
import Immutable from 'immutable'

import { AccountManagementHeader } from './account-management-header.jsx'
import RolesEditForm from './role-edit-form.jsx'
import ActionLinks from './action-links.jsx'

import './roles-list.scss';

function labelParentRoles(childRole, allRoles) {
  return childRole.get('parentRoles').map(id => {
    return allRoles
      .find(possibleParent => possibleParent.get('id') === id)
      .get('name')
  })
}

function labelPermissions(role, permissions) {
  return role.get('permissions').get('resources')
    .filter(rule => rule.find((rule) => rule.get('allowed') === true))
    .map((rule, key) => {
      return permissions
        .find(permission => permission.get('id') === key)
        .get('name')
    })
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
            {/* Not in 0.8
              <th>Available To</th>
            */}
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
                <td>
                  {labelPermissions(role, props.permissions).join(', ')}
                </td>
                {/* Not in 0.8
                  <td>
                    {labelParentRoles(role, props.roles).join(', ')}
                  </td>
                */}
                <td>
                  NEEDS API
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
  permissions: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.instanceOf(Immutable.List),
  showAddNewDialog: React.PropTypes.bool
}
RolesList.defaultProps = {
  permissions: Immutable.List([]),
  roles: Immutable.List([])
}

export default RolesList
