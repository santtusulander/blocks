import React from 'react'

import {FormattedMessage} from 'react-intl';

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
          <FormattedMessage id="portal.user.list.accountNotSelected.text" values={{br: <br/>}}/>
        </p>
      </div>

    )
  }
}

AccountManagementSystemUsers.displayName = 'AccountManagementSystemUsers'
AccountManagementSystemUsers.propTypes = {}

module.exports = AccountManagementSystemUsers
