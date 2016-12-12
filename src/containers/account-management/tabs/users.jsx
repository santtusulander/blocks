import React from 'react'
import { List, Map } from 'immutable'
import { Panel, PanelGroup, Table, Button, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { change, focus } from 'redux-form'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'
import * as rolesActionCreators from '../../../redux/modules/roles'
import * as uiActionCreators from '../../../redux/modules/ui'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import SelectWrapper from '../../../components/select-wrapper'
// import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'
import ActionButtons from '../../../components/action-buttons'
import InlineAdd from '../../../components/inline-add'
import IconAdd from '../../../components/icons/icon-add'
import IconInfo from '../../../components/icons/icon-info'
import TableSorter from '../../../components/table-sorter'
import UserEditModal from '../../../components/account-management/user-edit/modal'
import ArrayCell from '../../../components/array-td/array-td'
import ModalWindow from '../../../components/modal'

import { ROLES_MAPPING } from '../../../constants/account-management-options'

import { checkForErrors } from '../../../util/helpers'

import IsAllowed from '../../../components/is-allowed'
import { MODIFY_USER, CREATE_USER } from '../../../constants/permissions'

export class AccountManagementAccountUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'email',
      sortDir: 1,
      search: '',
      filteredGroups: 'all',
      filteredRoles: 'all',
      showEditModal: false,
      showPermissionsModal: false,
      addingNew: false,
      usersGroups: List(),
      existingMail: null,
      existingMailMsg: null
    }

    this.notificationTimeout = null
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.newUser = this.newUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.cancelUserEdit = this.cancelUserEdit.bind(this)
    this.toggleInlineAdd = this.toggleInlineAdd.bind(this)
    this.togglePermissionModal = this.togglePermissionModal.bind(this)
    this.shouldLeave = this.shouldLeave.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.isLeaving = false;
  }

  componentWillMount() {
    document.addEventListener('click', this.cancelAdding, false)
    const {router, route, params: { brand, account }} = this.props
    this.props.userActions.fetchUsers(brand, account)
    if (!this.props.groups.toJS().length) {
      this.props.groupActions.fetchGroups(brand, account);
    }
    this.props.rolesActions.fetchRoles()
    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.params.account !== nextProps.params.account) {
      !this.state.usersGroups.isEmpty() && this.setState({ usersGroups: List() })
      this.props.resetRoles()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.cancelAdding, false)
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  newUser({ email, roles }) {
    const { userActions: { createUser }, params: { brand, account }, formFieldFocus } = this.props
    const requestBody = {
      email,
      roles: [roles],
      brand_id: brand,
      account_id: Number(account),
      group_id: this.state.usersGroups.toJS()
    }
    createUser(requestBody).then(res => {
      if(res.error){
        this.setState({
          existingMail: requestBody.email,
          existingMailMsg: res.payload.message
        }, () => formFieldFocus('inlineAdd', 'email'))
      } else {
        this.toggleInlineAdd()
      }
    })
  }

  validateInlineAdd({ email = '', roles = '' }) {
    const conditions = {
      email: [
        {
          condition: email === this.state.existingMail,
          errorText: this.state.existingMailMsg
        },
        {
          condition: !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email),
          errorText: 'Invalid Email.'
        }
      ]
    }
    return checkForErrors({ email, roles }, conditions)
  }

  sortedData(data, sortBy, sortDir) {
    return data.sort((a, b) => {
      let aVal = a.get(sortBy)
      let bVal = b.get(sortBy)
      if(typeof a.get(sortBy) === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if(aVal < bVal) {
        return -1 * sortDir
      }
      else if(aVal > bVal) {
        return 1 * sortDir
      }
      return 0
    })
  }

  getRoleOptions(roleMapping, props) {
    return roleMapping
      .filter(role => role.accountTypes.includes(props.account.get('provider_type')))
      .map(mapped_role => [
        mapped_role.id,
        props.roles.find(role => role.get('id') === mapped_role.id).get('name')
      ])
  }

  getInlineAddFields() {
    /**
     * Each sub-array contains elements per <td>. If no elements are needed for a <td>, insert empty array [].
     * The positionClass-field is meant for positioning the div that wraps the input element and it's tooltip.
     * To get values from input fields via redux form, the input elements' IDs must match the inline add component's
     * fields-prop's array items.
     *
     */
    const roleOptions = this.getRoleOptions(ROLES_MAPPING, this.props)
    return [
      [{ input: <Input ref="emails" id='email' placeholder=" Email" type="text"/> }],
      [
        {
          input: <SelectWrapper
            id='roles'
            numericValues={true}
            className="inline-add-dropdown"
            options={roleOptions}/>,
          positionClass: 'row col-xs-10'
        },
        {
          input: <Button bsStyle="primary" className="btn-icon" onClick={this.togglePermissionModal}>
              <IconInfo/>
            </Button>,
          positionClass: 'col-xs-2 text-right'
        }
      ],
      [
        // Disable until API support allows listing groups for user with some assigned
        // {
        //   input: <FilterChecklistDropdown
        //     noClear={true}
        //     className="inline-add-dropdown"
        //     value={this.state.usersGroups}
        //     handleCheck={newValues => {
        //       this.setState({ usersGroups: newValues })
        //     }}
        //     options={this.props.groups.map(group => Map({ value: group.get('id'), label: group.get('name') }))}/>,
        //   positionClass: 'row col-xs-7'
        // }
      ]
    ]
  }

  toggleInlineAdd() {
    this.setState({ addingNew: !this.state.addingNew, usersGroups: List() })
  }

  togglePermissionModal() {
    this.setState({ showPermissionsModal: !this.state.showPermissionsModal })
  }

  getGroupsForUser(user) {
    const groups = user.get('group_id')
      .map(groupId => this.props.groups
        .find(group => group.get('id') === groupId, null, Map({ name: 'Loading' }))
        .get('name'))
      .toJS()
    return groups.length > 0 ? groups : ['User has no groups']
  }

  getRolesForUser(user) {
    return this.props.roles.size ? user.get('roles').map(roleId => this.props.roles.find(role => role.get('id') === roleId).get('name')).toJS() : []
  }

  getEmailForUser(user) {
    return user.get('email') || user.get('username')
  }

  shouldLeave({ pathname }) {
    if (!this.isLeaving && this.state.addingNew) {
      this.props.uiActions.showInfoDialog({
        title: 'Warning',
        content: 'You have made changes to the User(s), are you sure you want to exit without saving?',
        stayButton: true,
        continueButton: true,
        cancel: this.props.uiActions.hideInfoDialog,
        submit: () => {
          this.isLeaving = true
          this.props.router.push(pathname)
          this.props.uiActions.hideInfoDialog()
        }
      })
      return false;
    }
    return true
  }

  deleteUser(user) {
    if(user === this.props.currentUser) {
      this.props.uiActions.showInfoDialog({
        title: 'Error',
        content: 'You cannot delete the account you are logged in with.',
        okButton: true,
        cancel: this.props.uiActions.hideInfoDialog
      })
    }
    else {
      this.props.deleteUser(user)
    }
  }

  editUser(user) {
    this.setState({
      userToEdit: user,
      showEditModal: true
    })
  }

  cancelUserEdit() {
    this.setState({
      userToEdit: null,
      showEditModal: false
    })
  }

  saveUser(user) {
    // Get the username from the user we have in state for editing purposes.
    //user.username = this.state.userToEdit.get('username')

    this.props.userActions.updateUser(this.state.userToEdit.get('email'), user)
      .then((response) => {
        if (!response.error) {
          this.showNotification('Updates to user saved.')

          this.setState({
            userToEdit: null,
            showEditModal: false
          })
        }
      })
  }

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  render() {
    const users = this.props.users;
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const filteredUsersByRole = users.filter((user) => {
      if(this.state.filteredRoles === 'all') {
        return true
      } else {
        return user.get('roles').find(role => {
          return this.state.filteredRoles === role
        })
      }
    })
    const filteredUsersByGroup = filteredUsersByRole.filter((user) => {
      if(this.state.filteredGroups === 'all') {
        return true
      } else {
        return user.get('group_id').find(group => {
          return this.state.filteredGroups === group
        })
      }
    })
    const searchedUsers = filteredUsersByGroup.filter((user) => {
      return this.getEmailForUser(user).toLowerCase().includes(this.state.search.toLowerCase())
    })
    const sortedUsers = this.sortedData(
      searchedUsers,
      this.state.sortBy,
      this.state.sortDir
    )

    let roleOptions = this.getRoleOptions(ROLES_MAPPING, this.props)
    roleOptions.unshift(['all', 'All Roles'])

    const groupOptions = this.props.groups.map(group => [
      group.get('id'),
      group.get('name')
    ]).insert(0, ['all', 'All Groups']).toArray()
    const numHiddenUsers = users.size - sortedUsers.size;

    const usersSize = sortedUsers.size
    const usersText = ` User${sortedUsers.size === 1 ? '' : 's'}`
    const hiddenUserText = numHiddenUsers ? ` (${numHiddenUsers} hidden)` : ''
    const finalUserText = usersSize + usersText + hiddenUserText

    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={finalUserText}>
          <Input
            type="text"
            className="search-input"
            groupClassName="search-input-group inline"
            placeholder="Search"
            value={this.state.search}
            onChange={this.changeSearch} />
          <div className="form-group inline">
            <SelectWrapper
              id='filtered-roles'
              value={this.state.filteredRoles}
              onChange={value => {
                this.setState({ filteredRoles: value })
              }}
              options={roleOptions}/>
          </div>
          <div className="form-group inline">
            <SelectWrapper
              id='filtered-groups'
              value={this.state.filteredGroups}
              onChange={value => {
                this.setState({ filteredGroups: value })
              }}
              options={groupOptions}/>
          </div>
          <IsAllowed to={CREATE_USER}>
            <Button bsStyle="success" className="btn-icon"
              onClick={this.toggleInlineAdd}>
              <IconAdd />
            </Button>
          </IsAllowed>
        </SectionHeader>
        <Table striped={true}>
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="email" width="40%">
                Email
              </TableSorter>
              <th width="19%">Role</th>
              <th width="20%">Groups</th>
              <th width="1%"/>
            </tr>
          </thead>
          <tbody>
            {this.state.addingNew && <InlineAdd
              validate={this.validateInlineAdd}
              fields={['email', 'roles', 'group_id']}
              inputs={this.getInlineAddFields()}
              unmount={this.toggleInlineAdd}
              save={this.newUser}/>}
            {sortedUsers.map((user, i) => {
              return (
                <tr key={i}>
                  <td>
                    {this.getEmailForUser(user)}
                  </td>
                  <ArrayCell items={this.getRolesForUser(user)} maxItemsShown={4}/>
                  <ArrayCell items={this.getGroupsForUser(user)} maxItemsShown={4}/>
                  <td className="nowrap-column">
                    <IsAllowed to={MODIFY_USER}>
                      <ActionButtons
                        onEdit={() => {this.editUser(user)}}
                        onDelete={() => this.deleteUser(user.get('email'))} />
                    </IsAllowed>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        {sortedUsers.size === 0 &&
          <div className="text-center">
            {this.state.search.length > 0 ?
              <span>No users found with the search term &quot;{this.state.search}&quot;</span>
            :
              <span>No users found</span>
            }
            {this.state.filteredRoles !== 'all' &&
              <span> {this.state.search.length > 0 ? 'and ' : 'with '}
                a role of &quot;{this.props.roles.find(role => role.get('id') === this.state.filteredRoles).get('name')}&quot;</span>
            }
            {this.state.filteredGroups !== 'all' &&
              <span> within the group &quot;{this.props.groups.find(group => group.get('id') === this.state.filteredGroups).get('name')}&quot;</span>
            }
          </div>
        }
        {this.state.showEditModal &&
          <UserEditModal
            show={this.state.showEditModal}
            user={this.state.userToEdit}
            accountType={this.props.account.get('provider_type')}
            groups={this.props.groups}
            onCancel={this.cancelUserEdit}
            onSave={this.saveUser}
            roles={this.props.roles}
          />
        }
        {this.props.roles.size && this.props.permissions.size && this.state.showPermissionsModal &&
          <ModalWindow
            title="View Permissions"
            closeModal={true}
            closeButton={true}
            cancel={this.togglePermissionModal}>
              {this.props.roles.map((role, i) => (
                role.getIn(['permissions', 'ui']) ?
                <PanelGroup accordion={true} key={i} defaultActiveKey="">
                  <Panel header={role.get('name')} className="permission-panel" eventKey={i}>
                    <Table striped={true} key={i}>
                      <tbody>
                      {this.props.permissions.get('ui').map((uiPermission, i) => {
                        const permissionTitle = uiPermission.get('title')
                        const permissionName = uiPermission.get('name')
                        return(
                          <tr key={i}>
                            <td className="no-border">{permissionTitle}</td>
                            <td><b>{role.getIn(['permissions', 'ui']).get(permissionName) ? 'Yes' : 'No'}</b></td>
                          </tr>
                        )}
                      )}
                      </tbody>
                    </Table>
                  </Panel>
                </PanelGroup> : null
              ))}
          </ModalWindow>
        }
      </PageContainer>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
  account: React.PropTypes.instanceOf(Map),
  currentUser: React.PropTypes.string,
  deleteUser: React.PropTypes.func,
  formFieldFocus: React.PropTypes.func,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(List),
  params: React.PropTypes.object,
  permissions: React.PropTypes.instanceOf(Map),
  resetRoles: React.PropTypes.func,
  roles: React.PropTypes.instanceOf(List),
  rolesActions: React.PropTypes.object,
  route: React.PropTypes.object,
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  userActions: React.PropTypes.object,
  users: React.PropTypes.instanceOf(List)
}

function mapStateToProps(state) {
  return {
    form: state.form,
    roles: state.roles.get('roles'),
    users: state.user.get('allUsers'),
    currentUser: state.user.get('currentUser').get('email'),
    permissions: state.permissions,
    groups: state.group.get('allGroups')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetRoles: () => dispatch(change('inlineAdd', 'roles', '')),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    rolesActions: bindActionCreators(rolesActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    formFieldFocus: (form, field) => dispatch(focus(form, field))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagementAccountUsers))
