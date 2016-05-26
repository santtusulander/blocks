import React, { PropTypes } from 'react'
import { List } from 'immutable'

import { ActionLinks } from './action-links.jsx'

export const UserList = props => {
  const { records, editRecord, deleteRecord } = props
  return (
    <table className="table table-striped cell-text-left">
      <thead >
        <tr>
          <th width="30%">HOSTNAME</th>
          <th width="17%">RECORD TYPE</th>
          <th width="30%">ADDRESS</th>
          <th width="30%">TTL</th>
          <th width="8%"></th>
        </tr>
      </thead>
      <tbody>
        {!records.isEmpty() ? records.map((user, index) => {
          const id = user.id
          return (
            <tr key={index}>
              <td>{user.get('name')}</td>
              <td>{user.get('role')}</td>
              <td>{user.get('email')}</td>
              <td>
                <ActionLinks
                  onEdit={() => editRecord(id)}
                  onDelete={() => deleteRecord(id)}/>
              </td>
            </tr>
          )
        }) : <tr id="empty-msg"><td colSpan="4">No users</td></tr>}
      </tbody>
    </table>
  )
}

UserList.propTypes = {
  deleteRecord: PropTypes.func,
  editRecord: PropTypes.func,
  records: PropTypes.instanceOf(List)
}
UserList.defaultProps = {
  users: List()
}

