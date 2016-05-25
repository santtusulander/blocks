import React from 'react'
import Immutable from 'immutable'

class AccountManagementManageAccount extends React.Component {
  render() {
    if(!this.props.account || !this.props.account.size) {
      return <div>Loading...</div>
    }
    return (
      <div className="account-management-manage-account">
        <h1>{this.props.account.get('name')}</h1>
      </div>
    );
  }
}

AccountManagementManageAccount.displayName = 'AccountManagementManageAccount'
AccountManagementManageAccount.propTypes = {
  account: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = AccountManagementManageAccount
