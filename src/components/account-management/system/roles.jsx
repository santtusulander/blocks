import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import PageContainer from '../../shared/layout/page-container'
import LoadingSpinner from '../../loading-spinner/loading-spinner'
import RolesList from '../role-edit/roles-list.jsx'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import roleNamesActions from '../../../redux/modules/entities/role-names/actions'
import serviceTitleActions from '../../../redux/modules/entities/serviceTitles/actions'
import rolesActions from '../../../redux/modules/entities/roles/actions'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'


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
    this.populateRoleNames = this.populateRoleNames.bind(this)
  }

  componentWillMount() {

    this.props.fetchAccounts({ brand: this.props.params.brand})
    this.props.fetchServiceTitle({id: 'UI'})
    this.props.fetchRoleNames()
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.roleNames, nextProps.roleNames)) {
      return Promise.all(
        nextProps.roleNames.map(roleName => {
          return this.props.fetchRolePermissions({id: roleName.get('id')})
        })
      )
    }
  }

  populateRoleNames() {
    const { roleNames, roles } = this.props
    return !roleNames.isEmpty() ? roleNames.map(roleName => {
      const roleId = roleName.get('id').toString()
      return roleName.set('permissions', roles.get(roleId))
    }) : roleNames
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
    const filteredRoles = this.populateRoleNames()

    return (
      <PageContainer>
        {this.props.fetchingAccounts || this.props.fetchingRoles || this.props.fetchingPermissionNames
          ? <LoadingSpinner/>
          : <RolesList
            editRole={this.state.editRole}
            roles={filteredRoles}
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
  fetchRolePermissions: React.PropTypes.func,
  fetchServiceTitle: React.PropTypes.func,
  fetchingAccounts: React.PropTypes.bool,
  fetchingPermissionNames: React.PropTypes.bool,
  fetchingRoles: React.PropTypes.bool,
  params: React.PropTypes.object,
  permissions: React.PropTypes.instanceOf(Immutable.Map),
  roleNames: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.instanceOf(Immutable.Map)
}
AccountManagementSystemRoles.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.Map(),
  roleNames: Immutable.List(),
  users: Immutable.List()
}

function mapStateToProps(state) {
  return {
    fetchingAccounts: state.account.get('fetching'),
    fetchingRoles: getFetchingByTag(state, 'roles'),
    fetchingPermissionNames: getFetchingByTag(state, 'serviceTitles'),
    roleNames: state.entities.roleNames.toList(),
    roles: state.entities.roles,
    permissions: state.entities.serviceTitles
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAccounts: (params) => dispatch(accountActions.fetchAll(params)),
    fetchRoleNames: () => dispatch(roleNamesActions.fetchAll({})),
    fetchServiceTitle: (params) => dispatch(serviceTitleActions.fetchOne(params)),
    fetchRolePermissions: (params) => dispatch(rolesActions.fetchOne(params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemRoles)
