import React from 'react'

import RolesTab from '../roles-tab.jsx'
import RolesAddNew from '../roles-add-new.jsx'

const ROLE_UDN = 'role-udn'
const ROLE_CONTENT_PROVIDER = 'role-content-provider'
const ROLE_SERVICE_PROVIDER = 'role-service-provider'

const fakeRoles = [
  { id: 1, roleName: 'Role name #1', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 2, roleName: 'Role name #2', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 3, roleName: 'Role name #3', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 4, roleName: 'Role name #4', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
]

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
        <RolesTab roles={fakeRoles} onAdd={this.showAddNewRoleDialog} />
        <RolesAddNew show={this.state.showAddNewDialog} onCancel={this.hideAddNewRoleDialog} onSave={this.saveRole}/>
      </div>
    )
  }
}

AccountManagementSystemRoles.displayName = 'AccountManagementSystemRoles'
AccountManagementSystemRoles.propTypes = {}

module.exports = AccountManagementSystemRoles
