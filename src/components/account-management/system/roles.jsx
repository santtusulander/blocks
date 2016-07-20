import React from 'react'
import Immutable from 'immutable'

import RolesList from '../roles-list.jsx'

import { ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER } from '../../../constants/roles.js'

const fakeRoles = Immutable.fromJS([
  { id: 1, roleName: 'Role name #1', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER ]  },
  { id: 2, roleName: 'Role name #2', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 3, roleName: 'Role name #3', roles: [ ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 4, roleName: 'Role name #4', roles: [ ROLE_UDN, ROLE_SERVICE_PROVIDER ]  }
])

class AccountManagementSystemRoles extends React.Component {
  constructor(props){
    super(props)

    this.state = {showAddNewDialog: false}

    this.showAddNewRoleDialog = this.showAddNewRoleDialog.bind(this)
    this.hideAddNewRoleDialog = this.hideAddNewRoleDialog.bind(this)
    this.saveRole = this.saveRole.bind(this)
  }

  showAddNewRoleDialog(){
    this.setState({showAddNewDialog: true})
  }

  hideAddNewRoleDialog(){
    this.setState({showAddNewDialog: false})
  }

  saveRole(){
    console.log('SaveRole()');
    this.hideAddNewRoleDialog();
  }

  render() {
    return (
      <div className="account-management-system-roles">
        <RolesList roles={fakeRoles}
          onCancel={this.hideAddNewRoleDialog}
          onSave={this.saveRole}
          onAdd={this.showAddNewRoleDialog}
          showAddNewDialog={this.state.showAddNewDialog} />
      </div>
    )
  }
}

AccountManagementSystemRoles.displayName = 'AccountManagementSystemRoles'
AccountManagementSystemRoles.propTypes = {}

module.exports = AccountManagementSystemRoles
