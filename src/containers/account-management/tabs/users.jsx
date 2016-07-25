import React from 'react'
import { List } from 'immutable'
import { Table, Button, Row, Col, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'
import * as uiActionCreators from '../../../redux/modules/ui'

import SelectWrapper from '../../../components/select-wrapper'
import InlineAdd from '../../../components/inline-add'
import IconAdd from '../../../components/icons/icon-add'
import IconSupport from '../../../components/icons/icon-support'
import IconTrash from '../../../components/icons/icon-trash'
import TableSorter from '../../../components/table-sorter'

export class AccountManagementAccountUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'email',
      sortDir: 1,
      addingNew: false
    }
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.newUser = this.newUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.sortedData = this.sortedData.bind(this)
  }
  componentWillMount() {
    document.addEventListener('click', this.cancelAdding, false)
    const { brand, account, group } = this.props.params
    this.props.userActions.fetchUsers(brand, account, group)

    if (!this.props.groups.toJS().length) {
      this.props.groupActions.fetchGroups(brand, account);
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
  deleteUser(user) {
    return () => console.log("Delete user " + user);
  }

  newUser({ password, email, roles, group_id }) {
    const { userActions: { createUser } } = this.props
    const requestBody = {
      password,
      email,
      roles: [roles],
      group_id: [group_id]
    }
    if(group_id) {
      requestBody.group_id = [ group_id ]
    }
    createUser(requestBody)
  }

  checkForEmpty(fields, customConditions) {
    let errors = {}
    for(const fieldName in fields) {
      const field = fields[fieldName]
      if(field === '') {
        errors[fieldName] = 'Required'
      }
      else if(customConditions[fieldName] && customConditions[fieldName].condition) {
        errors[fieldName] = customConditions[fieldName].errorText
      }
    }
    return errors
  }

  validateInlineAdd({ email, password, confirmPw }) {
    const conditions = {
      confirmPw: {
        condition: confirmPw && password && confirmPw.length === password.length && confirmPw !== password,
        errorText: 'Passwords don\'t match!'
      },
      email: {
        condition: email && !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email),
        errorText: 'invalid email!'
      },
      password: {
        condition: password && password.length > 30,
        errorText: 'Password too long!'
      }
    }
    return this.checkForEmpty({ email, password, confirmPw }, conditions)
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
     * To get values from input fields, the input elements' IDs must match the fields-prop's array items.
     *
     */
    return [
      [
        { input: <Input id='email' placeholder=" Email" type="text"/> }
      ],
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
            className=" inline-add-dropdown"
            options={['SuperAdmin', 'Support'].map(item => [item, item])}/>
          , positionClass: 'left'
        },
        {
          input:
            <Button bsStyle="primary" className="btn-icon" onClick={() => console.log('modal')}>
              <IconSupport/>
            </Button>,
          positionClass: 'trailing-item'
        }
      ],
      [
        {
          input: <SelectWrapper
            id='group_id'
            numericValues={true}
            className=" inline-add-dropdown"
            options={this.props.groups.map(group => [ group.get('id'), group.get('name') ]).toJS()}/>,
          positionClass: 'left'
        }
      ]
    ]
  }

  getGroupsForUser(user) {
    const groupId = user.get('group_id')
    let groups = []

    this.props.groups.forEach(group => {
      if (group.get('id') === groupId) {
        groups.push(group.get('name'))
      }
    })

    if (!groups.length) {
      return <em>User has no groups</em>
    }

    return groups.length < 6 ? groups.join(', ') : `${groups.length} Groups`
  }
  getRolesForUser(user) {
    const roles = user.get('roles');
    return roles.size < 6 ? roles.join(', ') : `${roles.size} Roles`
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
              onClick={e => {e.stopPropagation(); this.setState({ addingNew: true })}}>
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
              <th width="10%"/>
            </tr>
          </thead>
          <tbody>
            {this.state.addingNew && <InlineAdd
              validate={this.validateInlineAdd}
              fields={['email', 'password', 'confirmPw', 'roles', 'group_id']}
              inputs={this.getInlineAddFields()}
              cancel={() => {}}
              unmount={() => this.setState({ addingNew: false })}
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
                  <td>
                    {this.getRolesForUser(user)}
                  </td>
                  <td>
                    {this.getGroupsForUser(user)}
                  </td>
                  <td>
                    <a href="#" onClick={this.editUser(user.get('id'))}>
                      EDIT
                    </a>
                    <Button onClick={() => this.props.deleteUser(user.get('username'))}
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
  deleteUser: React.PropTypes.func,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(List),
  params: React.PropTypes.object,
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
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagementAccountUsers))

