import React from 'react'
import Immutable from 'immutable'

import RolesList from '../roles-list.jsx'

const fakeRoles = Immutable.fromJS([
  { id: 1, name: 'UDN', parentRoles: []  },
  { id: 2, name: 'Content Provider', parentRoles: [1, 2]  },
  { id: 3, name: 'Service Provider', parentRoles: [1]  }
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
