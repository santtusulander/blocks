import React from 'react'
import Immutable from 'immutable'

import RolesList from '../roles-list.jsx'

class AccountManagementSystemRoles extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      editRole: null,
      showAddNewDialog: false
    }

    this.editRole = this.editRole.bind(this)
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

  editRole(id) {
    this.showAddNewRoleDialog()
    this.setState({
      editRole: this.props.roles.find(role => role.get('id') === id)
    })
  }

  saveRole(){
    console.log('SaveRole()');
    this.hideAddNewRoleDialog();
  }

  render() {
    return (
      <div className="container-fluid content-container">
        <RolesList
          editRole={this.state.editRole}
          roles={this.props.roles}
          users={this.props.users}
          permissions={this.props.permissions}
          onCancel={this.hideAddNewRoleDialog}
          onSave={this.saveRole}
          onAdd={this.showAddNewRoleDialog}
          onEdit={this.editRole}
          showAddNewDialog={this.state.showAddNewDialog} />
      </div>
    )
  }
}

AccountManagementSystemRoles.displayName = 'AccountManagementSystemRoles'
AccountManagementSystemRoles.propTypes = {
  permissions: React.PropTypes.instanceOf(Immutable.Map),
  roles: React.PropTypes.instanceOf(Immutable.List),
  users: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementSystemRoles.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.List(),
  users: Immutable.List()
}

module.exports = AccountManagementSystemRoles
