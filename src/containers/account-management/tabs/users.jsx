import React from 'react'
import { List, Map } from 'immutable'
import { Panel, PanelGroup, Table, Button, Row, Col, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { change, focus } from 'redux-form'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'
import * as permissionsActionCreators from '../../../redux/modules/permissions'
import * as rolesActionCreators from '../../../redux/modules/roles'
import * as uiActionCreators from '../../../redux/modules/ui'

import SelectWrapper from '../../../components/select-wrapper'
import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'
import InlineAdd from '../../../components/inline-add'
import IconAdd from '../../../components/icons/icon-add'
import IconEye from '../../../components/icons/icon-eye'
import IconInfo from '../../../components/icons/icon-info'
import IconTrash from '../../../components/icons/icon-trash'
import TableSorter from '../../../components/table-sorter'
import UserEditModal from '../../../components/account-management/user-edit/modal'
import ArrayCell from '../../../components/array-td/array-td'
import ActionModal from '../../../components/action-modal'

import { ROLES_MAPPING } from '../../../constants/account-management-options'

import { checkForErrors } from '../../../util/helpers'

export class AccountManagementAccountUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'email',
      sortDir: 1,
      showEditModal: false,
      showPermissionsModal: false,
      addingNew: false,
      passwordVisible: false,
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
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.togglePermissionModal = this.togglePermissionModal.bind(this)
  }

  componentWillMount() {
    document.addEventListener('click', this.cancelAdding, false)
    const { brand, account } = this.props.params
    this.props.userActions.fetchUsers(brand, account)
    if (!this.props.groups.toJS().length) {
      this.props.groupActions.fetchGroups(brand, account);
    }
    this.props.rolesActions.fetchRoles()
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

  newUser({ password, email, roles }) {
    const { userActions: { createUser }, params: { brand, account }, formFieldFocus } = this.props
    const requestBody = {
      password,
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

  validateInlineAdd({ email = '', password = '', confirmPw = '', roles = '' }) {
    const conditions = {
      confirmPw: {
        condition: confirmPw.length === password.length && confirmPw !== password,
        errorText: 'Passwords don\'t match!'
      },
      email: [
        {
          condition: email === this.state.existingMail,
          errorText: this.state.existingMailMsg
        },
        {
          condition: !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email),
          errorText: 'invalid email!'
        }
      ],
      password: {
        condition: password.length > 30,
        errorText: 'Password too long!'
      }
    }
    return checkForErrors({ email, password, confirmPw, roles }, conditions)
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

  getInlineAddFields() {
    /**
     * Each sub-array contains elements per <td>. If no elements are needed for a <td>, insert empty array [].
     * The positionClass-field is meant for positioning the div that wraps the input element and it's tooltip.
     * To get values from input fields via redux form, the input elements' IDs must match the inline add component's
     * fields-prop's array items.
     *
     */
    const roleOptions = ROLES_MAPPING
      .filter(role => role.accountTypes.includes(this.props.account.get('provider_type')))
      .map(mapped_role => [
        mapped_role.id,
        this.props.roles.find(role => role.get('id') === mapped_role.id).get('name')
      ])
    return [
      [ { input: <Input ref="emails" id='email' placeholder=" Email" type="text"/> } ],
      [
        {
          input: <Input id='password' placeholder=" Password"
            type={this.state.passwordVisible ? 'text' : 'password'}/>,
          positionClass: 'password-field left'
        },
        {
          input: <Input id='confirmPw' placeholder=" Confirm password"
            type={this.state.passwordVisible ? 'text' : 'password'}
            wrapperClassName={'input-addon-after-outside'}
            addonAfter={<a className={'input-addon-link' +
                (this.state.passwordVisible ? ' active' : '')}
                onClick={this.togglePasswordVisibility}>
                  <IconEye/>
              </a>}/>,
          positionClass: 'password-field left'
        }
      ],
      [
        {
          input: <SelectWrapper
            id='roles'
            numericValues={true}
            className="inline-add-dropdown"
            options={roleOptions}/>,
          positionClass: 'col-sm-9'
        },
        {
          input: <Button bsStyle="primary" className="btn-icon" onClick={this.togglePermissionModal}>
              <IconInfo/>
            </Button>,
          positionClass: 'right'
        }
      ],
      [
        {
          input: <FilterChecklistDropdown
            noClear={true}
            className="inline-add-dropdown"
            values={this.state.usersGroups}
            handleCheck={newValues => {
              this.setState({ usersGroups: newValues })
            }}
            options={this.props.groups.map(group => Map({ value: group.get('id'), label: group.get('name') }))}/>,
          positionClass: 'col-sm-6'
        }
      ]
    ]
  }

  toggleInlineAdd() {
    this.setState({ addingNew: !this.state.addingNew, usersGroups: List() })
  }

  togglePermissionModal() {
    this.setState({ showPermissionsModal: !this.state.showPermissionsModal })
  }

  togglePasswordVisibility() {
    this.setState({
      passwordVisible: !this.state.passwordVisible
    })
  }

  getGroupsForUser(user) {
    const groups = user.get('group_id')
      .map(groupId => this.props.groups.find(group => group.get('id') === groupId).get('name'))
      .toJS()
    return groups.length > 0 ? groups : ['User has no groups']
  }
  getRolesForUser(user) {
    return this.props.roles.size ? user.get('roles').map(roleId => this.props.roles.find(role => role.get('id') === roleId).get('name')).toJS() : []
  }

  getEmailForUser(user) {
    return user.get('email') || user.get('username')
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
  render() {
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedUsers = this.sortedData(
      this.props.users,
      this.state.sortBy,
      this.state.sortDir
    )
    return (
      <div className="account-management-account-users">
        <Row className="header-btn-row">
          <Col sm={8}>
            <h3>
              {this.props.users.size} User{this.props.users.size === 1 ? '' : 's'}
            </h3>
          </Col>
          <Col sm={4} className="text-right">
            <Button bsStyle="success" className="btn-icon btn-add-new"
              onClick={this.toggleInlineAdd}>
              <IconAdd />
            </Button>
          </Col>
        </Row>
        <Table striped={true}>
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="email" width="20%">
                Email
              </TableSorter>
              <th width="20%">Password</th>
              <th width="20%">Role</th>
              <th width="20%">Groups</th>
              <th width="8%"/>
            </tr>
          </thead>
          <tbody>
            {this.state.addingNew && <InlineAdd
              validate={this.validateInlineAdd}
              fields={['email', 'password', 'confirmPw', 'roles', 'group_id']}
              inputs={this.getInlineAddFields()}
              unmount={this.toggleInlineAdd}
              save={this.newUser}/>}
            {this.props.groups.size !== 0 && sortedUsers.map((user, i) => {
              return (
                <tr key={i}>
                  <td>
                    {this.getEmailForUser(user)}
                  </td>
                  <td>
                    ********
                  </td>
                  <ArrayCell items={this.getRolesForUser(user)} maxItemsShown={4}/>
                  <ArrayCell items={this.getGroupsForUser(user)} maxItemsShown={4}/>
                  <td>
                    <a href="#" onClick={() => {this.editUser(user)}}>
                      EDIT
                    </a>
                    <Button onClick={() => this.props.deleteUser(this.getEmailForUser(user))}
                      className="btn-link btn-icon">
                      <IconTrash/>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        {this.state.showEditModal &&
          <UserEditModal
            show={this.state.showEditModal}
            user={this.state.userToEdit}
            groups={this.props.groups}
            onCancel={this.cancelUserEdit}
            onSave={this.saveUser}
            roles={this.props.roles}
          />
        }
        {this.props.roles.size && this.props.permissions.size && this.state.showPermissionsModal &&
          <ActionModal
            show={this.state.showPermissionsModal}
            title="View Permissions"
            showClose={true}
            closeModal={this.togglePermissionModal}
            buttons={
              <Button
                className="btn-save"
                onClick={this.togglePermissionModal}>CLOSE</Button>
            }>
              {this.props.roles.map((role, i) => (
                <PanelGroup accordion={true} key={i} defaultActiveKey="">
                  <Panel header={role.get('name')} className="permission-panel" eventKey={i}>
                    <Table striped={true} key={i}>
                      <tbody>
                      {this.props.permissions.get('ui').map((permission, i) => (
                        <tr key={i}>
                          <td className="no-border">{permission.get('title')}</td>
                          <td><b>{role.get('permissions').get('ui').get(permission.get('name')) ? 'Yes' : 'No'}</b></td>
                        </tr>
                      ))}
                      </tbody>
                    </Table>
                  </Panel>
                </PanelGroup>
              ))}
          </ActionModal>
        }
      </div>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
  account: React.PropTypes.instanceOf(Map),
  deleteUser: React.PropTypes.func,
  formFieldFocus: React.PropTypes.func,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(List),
  params: React.PropTypes.object,
  permissions: React.PropTypes.instanceOf(Map),
  permissionsActions: React.PropTypes.object,
  resetRoles: React.PropTypes.func,
  roles: React.PropTypes.instanceOf(List),
  rolesActions: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  userActions: React.PropTypes.object,
  users: React.PropTypes.instanceOf(List)
}

function mapStateToProps(state) {
  return {
    roles: state.roles.get('roles'),
    users: state.user.get('allUsers'),
    permissions: state.permissions,
    groups: state.group.get('allGroups')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetRoles: () => dispatch(change('inlineAdd', 'roles', '')),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    permissionsActions: bindActionCreators(permissionsActionCreators, dispatch),
    rolesActions: bindActionCreators(rolesActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    formFieldFocus: (form, field) => dispatch(focus(form, field))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagementAccountUsers))
