import React from 'react'
import { List, Map } from 'immutable'
import { Table, Button, Row, Col, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { change } from 'redux-form'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'
import * as uiActionCreators from '../../../redux/modules/ui'

import SelectWrapper from '../../../components/select-wrapper'
import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'
import InlineAdd from '../../../components/inline-add'
import IconAdd from '../../../components/icons/icon-add'
import IconInfo from '../../../components/icons/icon-info'
import IconTrash from '../../../components/icons/icon-trash'
import TableSorter from '../../../components/table-sorter'
import ArrayCell from '../../../components/array-td/array-td'

import { ROLES } from '../../../constants/account-management-options'

import { checkForErrors } from '../../../util/helpers'

export class AccountManagementAccountUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'email',
      sortDir: 1,
      addingNew: false,
      usersGroups: List()
    }
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.newUser = this.newUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.toggleInlineAdd = this.toggleInlineAdd.bind(this)
  }

  componentWillMount() {
    document.addEventListener('click', this.cancelAdding, false)
    const { brand, account } = this.props.params
    this.props.userActions.fetchUsers(brand, account)

    if (!this.props.groups.toJS().length) {
      this.props.groupActions.fetchGroups(brand, account);
    }
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

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  newUser({ password, email, roles }) {
    const { userActions: { createUser }, params: { brand, account } } = this.props
    const requestBody = {
      password,
      email,
      roles: [roles],
      brand_id: brand,
      account_id: Number(account),
      group_id: this.state.usersGroups.toJS()
    }
    createUser(requestBody).then(this.toggleInlineAdd)
  }

  validateInlineAdd({ email = '', password = '', confirmPw = '', roles = '' }) {
    const conditions = {
      confirmPw: {
        condition: confirmPw.length === password.length && confirmPw !== password,
        errorText: 'Passwords don\'t match!'
      },
      email: {
        condition: !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email),
        errorText: 'invalid email!'
      },
      password: {
        condition: password.length > 30,
        errorText: 'Password too long!'
      }
    }
    return checkForErrors({ email, password, confirmPw, roles }, conditions)
  }

  editUser(user) {
    return e => {
      console.log("Edit user " + user);
      e.preventDefault();
    };
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
    const roles = ROLES
      .filter(role => role.accountTypes.includes(this.props.account.get('provider_type')))
      .map(role => [ role.id, role.label ])
    return [
      [ { input: <Input id='email' placeholder=" Email" type="text"/> } ],
      [
        {
          input: <Input id='password' placeholder=" Password" type="text"/>,
          positionClass: 'half-width-item left'
        },
        {
          input: <Input id='confirmPw' placeholder=" Confirm password" type="text"/>,
          positionClass: 'half-width-item right'
        }
      ],
      [
        {
          input: <SelectWrapper
            id='roles'
            numericValues={true}
            className="inline-add-dropdown"
            options={roles}/>,
          positionClass: 'col-sm-9'
        },
        {
          input: <Button bsStyle="primary" className="btn-icon" onClick={() => console.log('modal')}>
              <IconInfo/>
            </Button>,
          positionClass: 'right'
        }
      ],
      [
        {
          input: <FilterChecklistDropdown
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

  getGroupsForUser(user) {
    const groups = user.get('group_id')
      .map(groupId => this.props.groups.find(group => group.get('id') === groupId).get('name'))
      .toJS()
    return groups.length > 0 ? groups : ['User has no groups']
  }
  getRolesForUser(user) {
    return user.get('roles').map(roleId => ROLES.find(role => role.id === roleId).label).toJS()
  }

  getEmailForUser(user) {
    return user.get('email') || user.get('username')
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
            {sortedUsers.map((user, i) => {
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
                    <a href="#" onClick={this.editUser(user.get('id'))}>
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
      </div>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
  account: React.PropTypes.instanceOf(Map),
  deleteUser: React.PropTypes.func,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(List),
  params: React.PropTypes.object,
  resetRoles: React.PropTypes.func,
  userActions: React.PropTypes.object,
  users: React.PropTypes.instanceOf(List)
}

function mapStateToProps(state) {
  return {
    users: state.user.get('allUsers'),
    groups: state.group.get('allGroups')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetRoles: () => dispatch(change('inlineAdd', 'roles', '')),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagementAccountUsers))
