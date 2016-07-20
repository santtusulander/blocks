import React from 'react'
import Immutable from 'immutable'

import RolesList from '../roles-list.jsx'

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
        <RolesList roles={this.props.roles}
          onCancel={this.hideAddNewRoleDialog}
          onSave={this.saveRole}
          onAdd={this.showAddNewRoleDialog}
          showAddNewDialog={this.state.showAddNewDialog} />
      </div>
    )
  }
}

AccountManagementSystemRoles.displayName = 'AccountManagementSystemRoles'
AccountManagementSystemRoles.propTypes = {
  roles: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementSystemRoles.defaultProps = {
  roles: Immutable.List()
}

module.exports = AccountManagementSystemRoles
