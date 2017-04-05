import React, { PropTypes } from 'react'
import { List } from 'immutable'

import ActionButtons from '../../components/shared/action-buttons.jsx'
import { AccountManagementHeader } from './account-management-header.jsx'

import { FormattedMessage } from 'react-intl'

const UserList = props => {
  const { users, editUser, deleteUser, addUser } = props
  return (
    <div>
      <AccountManagementHeader title={`${users.size} Users`} onAdd={addUser}/>
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <th width="30%"><FormattedMessage id="portal.user.list.name.column.title"/></th>
            <th width="30%"><FormattedMessage id="portal.user.list.role.column.title"/></th>
            <th width="30%"><FormattedMessage id="portal.user.list.email.column.title"/></th>
            <th width="1%" />
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
                <td className="nowrap-column">
                  <ActionButtons
                    onEdit={() => editUser(id)}
                    onDelete={() => deleteUser(id)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="4"><FormattedMessage id="portal.user.list.noUsers.text"/></td></tr>}
        </tbody>
      </table>
    </div>
  )
}

UserList.displayName = "UserList"
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
