import React from 'react'

// import UserList from '../user-list.jsx'

class AccountManagementSystemUsers extends React.Component {
  render() {
    return (
      <div className="account-management-system-users">
        {/* Not in 0.8
          <UserList
          users={fakeUsers}
          addUser={() => console.log('add user')}
          deleteUser={() => console.log('delete user')}
          editUser={() => console.log('edit user')}/>*/}
        <p className="text-center">
          Please select an account
          <br/>
          from top left to see users
        </p>
      </div>

    )
  }
}

AccountManagementSystemUsers.displayName = 'AccountManagementSystemUsers'
AccountManagementSystemUsers.propTypes = {}

module.exports = AccountManagementSystemUsers
