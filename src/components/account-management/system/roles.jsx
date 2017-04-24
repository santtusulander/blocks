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
    this.getPermissionTitle = this.getPermissionTitle.bind(this)
    this.populateRoleNames = this.populateRoleNames.bind(this)
  }

  componentWillMount() {

    this.props.fetchAccounts({ brand: this.props.params.brand})
    this.props.fetchServiceTitle({id: 'UI'})
    this.props.fetchRoleNames()
  }

  componentWillReceiveProps(nextProps) {
    if (Immutable.is(this.props.roles, nextProps.roles)) {
      return Promise.all(
        this.props.roles.map(roleName => {
          return this.props.fetchRolePermissions({id: roleName.get('id')})
        })
      )
    }
  }

  getPermissionTitle() {
    const { roles, serviceTitles } = this.props
    if (!Immutable.isEmpty(roles) && !Immutable.isEmpty(serviceTitles)) {
      const sampleUIRoles =  roles[0].get('ui')
      return Object.keys(sampleUIRoles).map(role => {
        return {
          name: role,
          title: serviceTitles.find(service => role === service.get('name'))
        }
      })
    }
    return []
  }

  populateRoleNames() {
    const { roles, roleNames } = this.props
    // const titles = this.getPermissionTitle()
    return roleNames.size() ? roleNames.map(roleName => {
      // if (roleName.get('id') && roles[roleName.get('id')]) {
      //   return {
      //     id: roleName.get('id'),
      //     roleName: roleName.get('name'),
      //     roles: roles[roleName.get('id')].get('ui').mapKeys((rName, rValue) => {
      //       return rValue ? titles.find(tit => tit.name === rName) : ''
      //     })
      //   }
      // }
      return {
        id: roleName.get('id'),
        name: roleName.get('name')
      }
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
        {this.props.fetchingAccounts || this.props.fetchingUsers
          ? <LoadingSpinner/>
          : <RolesList
            editRole={this.state.editRole}
            roles={this.props.filteredRoles}
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
  fetchRolePermissions: React.PropTypes.func,
  fetchServiceTitle: React.PropTypes.func,
  fetchingAccounts: React.PropTypes.bool,
  fetchingUsers: React.PropTypes.bool,
  params: React.PropTypes.object,
  permissions: React.PropTypes.instanceOf(Immutable.Map),
  roleNames: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.instanceOf(Immutable.List),
  serviceTitles: React.PropTypes.instanceOf(Immutable.List),
  users: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementSystemRoles.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.List(),
  roleNames: Immutable.List(),
  users: Immutable.List(),
  serviceTitles: Immutable.List()
}

function mapStateToProps(state) {
  return {
    fetchingAccounts: state.account.get('fetching'),
    fetchingUsers: state.user.get('fetching'),
    roleNames: state.entities.roleNames.toList(),
    roles: state.entities.roles.toList(),
    serviceTitles: state.entities.serviceTitles.getIn(['UI','resources'])
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
