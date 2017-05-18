import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map, List, is } from 'immutable'

import PageContainer from '../../../components/shared/layout/page-container'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import RolesList from '../../../components/account-management/role-edit/roles-list.jsx'
import RoleEditForm from '../modals/role-edit-form.jsx'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import roleNamesActions from '../../../redux/modules/entities/role-names/actions'
import serviceTitleActions from '../../../redux/modules/entities/serviceTitles/actions'
import rolesActions from '../../../redux/modules/entities/roles/actions'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'


class AccountManagementSystemRoles extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddNewDialog: false
    }

    this.showAddNewRoleDialog = this.showAddNewRoleDialog.bind(this)
    this.hideAddNewRoleDialog = this.hideAddNewRoleDialog.bind(this)

    this.editRole = this.editRole.bind(this)
    this.saveRole = this.saveRole.bind(this)

    this.populateRoleNames = this.populateRoleNames.bind(this)
  }

  componentWillMount() {
    this.props.fetchAccounts({ brand: this.props.params.brand})
    this.props.fetchServiceTitle({id: 'UI'})
    if (this.props.roleNames.isEmpty()) {
      this.props.fetchRoleNames()
    } else {
      if (this.props.roleNames.size > this.props.roles.size) {
        Promise.all(
          this.props.roleNames.map(roleName => {
            return this.props.fetchRolePermissions({id: roleName.get('id')})
          })
        )
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!is(this.props.roleNames, nextProps.roleNames)) {
      Promise.all(
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
    this.setState({
      selectedRoleId: id
    })

    this.showAddNewRoleDialog()
  }

  saveRole() {
    this.hideAddNewRoleDialog();
  }

  render() {
    const { fetchingAccounts, fetchingRoles, fetchingRoleNames, fetchingPermissionNames } = this.props
    const roleWithPermissions = this.populateRoleNames()

    const {showAddNewDialog} = this.state

    return (
      <PageContainer>
        {fetchingAccounts || fetchingRoles || fetchingPermissionNames || fetchingRoleNames
          ? <LoadingSpinner/>
          : <RolesList
              roles={roleWithPermissions}
              permissions={this.props.permissions}
              //onSave={this.saveRole}
              onEdit={this.editRole}
            />
        }

        {showAddNewDialog && <RoleEditForm
            roleId={this.state.selectedRoleId}
            onCancel={this.hideAddNewRoleDialog}
          />
        }
      </PageContainer>
    )
  }
}

AccountManagementSystemRoles.displayName = 'AccountManagementSystemRoles'
AccountManagementSystemRoles.propTypes = {
  fetchAccounts: PropTypes.func,
  fetchRoleNames: PropTypes.func,
  fetchRolePermissions: PropTypes.func,
  fetchServiceTitle: PropTypes.func,
  fetchingAccounts: PropTypes.bool,
  fetchingPermissionNames: PropTypes.bool,
  fetchingRoleNames: PropTypes.bool,
  fetchingRoles: PropTypes.bool,
  params: PropTypes.object,
  permissions: PropTypes.instanceOf(Map),
  roleNames: PropTypes.instanceOf(List),
  roles: PropTypes.instanceOf(Map)
}
AccountManagementSystemRoles.defaultProps = {
  permissions: Map(),
  roles: Map(),
  roleNames: List(),
  users: List()
}

const mapStateToProps = (state) => {
  return {
    fetchingAccounts: getFetchingByTag(state, 'accounts'),
    fetchingRoles: getFetchingByTag(state, 'roles'),
    fetchingRoleNames: getFetchingByTag(state, 'roleNames'),
    fetchingPermissionNames: getFetchingByTag(state, 'serviceTitles'),
    //TODO: Should use selectors
    roleNames: state.entities.roleNames.toList(),
    roles: state.entities.roles,
    permissions: state.entities.serviceTitles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAccounts: (params) => dispatch(accountActions.fetchAll(params)),
    fetchRoleNames: () => dispatch(roleNamesActions.fetchAll({})),
    fetchServiceTitle: (params) => dispatch(serviceTitleActions.fetchOne(params)),
    fetchRolePermissions: (params) => dispatch(rolesActions.fetchOne(params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemRoles)
