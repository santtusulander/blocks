import React from 'react'
import Immutable from 'immutable'

import { AccountManagementHeader } from './account-management-header.jsx'
import RolesEditForm from './role-edit-form.jsx'
import ActionLinks from './action-links.jsx'

import { ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER } from '../../constants/roles.js'

import './roles-list.scss';

function labelChildRoles(parentRole, allRoles) {
  return parentRole.get('roles').map(role => {
    return allRoles
      .find(possibleChild => possibleChild.get('id') === role.get('id'))
      .get('roleName')
  })
}

export const RolesList = props => {

  if (!props.roles || props.roles.length == 0) {
    return (
      <div id="empty-msg">
        <p>No roles found</p>
      </div>
    )
  }

  return (
    <div className='roles-list'>

      <AccountManagementHeader
        title={`${props.roles.count() } Roles`}
        onAdd={props.onAdd}/>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
            <th>Available To</th>
            <th>Assigned To</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {props.roles.map( (role, i) => {
            return (
              <tr className='roles-list-row' key={i}>
                <td>
                  {role.get('roleName')}
                </td>
                <td>
                  Permissions here
                </td>
                <td>
                  {labelChildRoles(role, props.roles).join(', ')}
                </td>
                <td>
                  NEEDS API
                </td>
                <td>
                  <ActionLinks
                    onEdit={() => this.props.onEdit(role.get('id'))}
                    onDelete={() => this.props.onDelete(role.get('id'))}/>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>

      <RolesEditForm
        show={props.showAddNewDialog}
        onCancel={props.onCancel}
        onSave={props.onSave}/>

    </div>
  )
}
RolesList.propTypes = {
  onAdd: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onSave: React.PropTypes.func,
  roles: React.PropTypes.instanceOf(Immutable.List),
  showAddNewDialog: React.PropTypes.bool
}
RolesList.defaultProps = {
  account: Immutable.Map({}),
  groups: Immutable.List([]),
  user: Immutable.Map({})
}

export default RolesList
