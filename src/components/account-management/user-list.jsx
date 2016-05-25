import React, { PropTypes } from 'react'

import { ActionLinks } from './action-links.jsx'

export const UserList = props => {
  const { users, editUser, deleteUser } = props
  return (
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
        {users.map((user, index) => {
          const id = user.id
          return (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>
                <ActionLinks edit={() => editUser(id)} delete={() => deleteUser(id)}/>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

UserList.propTypes = {
  deleteUser: PropTypes.func,
  editUser: PropTypes.func,
  users: PropTypes.array
}
UserList.defaultProps = {
  users: []
}

