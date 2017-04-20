import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import PageContainer from '../../shared/layout/page-container'
import LoadingSpinner from '../../loading-spinner/loading-spinner'
import RolesList from '../role-edit/roles-list.jsx'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import roleNamesActions from '../../../redux/modules/entities/role-names/actions'

class AccountManagementSystemRoles extends React.Component {
  constructor(props) {
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

  componentWillMount() {

    this.props.fetchAccounts({ brand: this.props.params.brand})
    this.props.fetchRoleNames()
  }

  showAddNewRoleDialog() {
    this.setState({showAddNewDialog: true})
  }

  hideAddNewRoleDialog() {
    this.setState({showAddNewDialog: false})
  }

  editRole(id) {
    this.showAddNewRoleDialog()
    this.setState({
      editRole: this.props.roles.find(role => role.get('id') === id)
    })
  }

  saveRole() {
    this.hideAddNewRoleDialog();
  }

  render() {
    return (
      <PageContainer>
        {this.props.fetchingAccounts || this.props.fetchingUsers
          ? <LoadingSpinner/>
          : <RolesList
            editRole={this.state.editRole}
            roles={this.props.roles}
            users={this.props.users}
            permissions={this.props.permissions}
            onCancel={this.hideAddNewRoleDialog}
            onSave={this.saveRole}
            onEdit={this.editRole}
            showAddNewDialog={this.state.showAddNewDialog} />
        }
      </PageContainer>
    )
  }
}

AccountManagementSystemRoles.displayName = 'AccountManagementSystemRoles'
AccountManagementSystemRoles.propTypes = {
  fetchAccounts: React.PropTypes.func,
  fetchRoleNames: React.PropTypes.func,
  fetchingAccounts: React.PropTypes.bool,
  fetchingUsers: React.PropTypes.bool,
  params: React.PropTypes.object,
  permissions: React.PropTypes.instanceOf(Immutable.Map),
  roles: React.PropTypes.instanceOf(Immutable.List),
  users: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementSystemRoles.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.List(),
  users: Immutable.List()
}

function mapStateToProps(state) {
  return {
    fetchingAccounts: state.account.get('fetching'),
    fetchingUsers: state.user.get('fetching'),
    roles: state.entities.roleNames.toList()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAccounts: (params) => dispatch(accountActions.fetchAll(params)),
    fetchRoleNames: () => dispatch(roleNamesActions.fetchAll({}))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemRoles)
