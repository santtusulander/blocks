import React from 'react'
import { fromJS } from 'immutable'

import UserList from '../user-list.jsx'

const fakeUsers = fromJS([
  {id: 1, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 2, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'},
  {id: 3, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 4, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'},
  {id: 5, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 6, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'}
])

class AccountManagementSystemUsers extends React.Component {
  render() {
    return (
      <div className="account-management-system-users">
        <UserList
          users={fakeUsers}
          addUser={() => console.log('add user')}
          deleteUser={() => console.log('delete user')}
          editUser={() => console.log('edit user')}/>
      </div>
    )
  }
}

AccountManagementSystemUsers.displayName = 'AccountManagementSystemUsers'
AccountManagementSystemUsers.propTypes = {}

module.exports = AccountManagementSystemUsers
