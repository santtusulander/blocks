import React, { PropTypes } from 'react'
import { List } from 'immutable'

import ActionLinks from './action-links.jsx'
import { AccountManagementHeader } from './account-management-header.jsx'

export const UserList = props => {
  const { users, editUser, deleteUser, addUser } = props
  return (
    <div>
      <AccountManagementHeader title={`${users.size} Users`} onAdd={addUser}/>
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <th width="30%">NAME</th>
            <th width="30%">ROLE</th>
            <th width="30%">EMAIL</th>
            <th width="8%"></th>
          </tr>
        </thead>
        <tbody>
          {!users.isEmpty() ? users.map((user, index) => {
            const id = user.get('id')
            return (
              <tr key={index}>
                <td>{user.get('name')}</td>
                <td>{user.get('role')}</td>
                <td>{user.get('email')}</td>
                <td>
                  <ActionLinks
                    onEdit={() => editUser(id)}
                    onDelete={() => deleteUser(id)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="4">No users</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

UserList.propTypes = {
  addUser: PropTypes.func,
  deleteUser: PropTypes.func,
  editUser: PropTypes.func,
  users: PropTypes.instanceOf(List)
}
UserList.defaultProps = {
  users: List()
}

export default UserList
