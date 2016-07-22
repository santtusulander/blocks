import React from 'react'
import { List, fromJS } from 'immutable'
import { Table, Button, Row, Col, Modal, Input } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'
import * as uiActionCreators from '../../../redux/modules/ui'

import SelectWrapper from '../../../components/select-wrapper'
import InlineAdd from '../../../components/inline-add'
import IconAdd from '../../../components/icons/icon-add'
import IconTrash from '../../../components/icons/icon-trash'
import TableSorter from '../../../components/table-sorter'
import UserEditModal from '../../../components/account-management/user-edit/modal'

/**
 * Each sub-array contains elements per <td>. If no elements are needed for a <td>, insert empty array [].
 * The positionClass-field is meant for positioning the div that wraps the input element and it's tooltip.
 * To get values from input fields, the input elements' IDs must match the field prop's array items.
 */
const inlineAddInputs = [
  [
    { input: <Input id='a' placeholder=" Name" type="text"/>, positionClass: 'half-width-item left' },
    { input: <Button>Do something</Button>, positionClass: 'trailing-item'}
  ],
  [
    { input: <Input id='b' placeholder=" Some" type="text"/>, positionClass: 'half-width-item left' },
    { input: <Input id='c' placeholder=" Things" type="text"/>, positionClass: 'half-width-item right' }
  ],
  [ {
    input: <SelectWrapper
        id='d'
        numericValues={true}
        className=" inline-add-dropdown"
        options={[1, 2, 3 ,4, 5].map(item => [item, item])}/>
    , positionClass: 'left'
  } ],
  []
]

export class AccountManagementAccountUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'email',
      sortDir: 1,
      showEditModal: false,
      addingNew: false
    }
    this.changeSort = this.changeSort.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.cancelUserEdit = this.cancelUserEdit.bind(this)
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
  validateInlineAdd({ a, b, c }) {
    let errors = {}
    if( a && a.length > 0) {
      errors.a = 'insert validation'
    }
    if( b && b.length > 0) {
      errors.b = 'insert validation'
    }
    if( c && c.length > 0) {
      errors.c = 'insert validation'
    }
    return errors
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

    user = {
      ...this.state.userToEdit.toJS(),
      ...user
    }

    this.props.userActions.updateUser(user)
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
              <th width="10%"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.addingNew && <InlineAdd
              validate={this.validateInlineAdd}
              fields={['a', 'b', 'c', 'd']}
              inputs={inlineAddInputs}
              cancel={() => {}}
              unmount={() => this.setState({ addingNew: false })}
              save={vals => console.log(vals)}/>}
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
                    <a href="#" onClick={() => {this.editUser(user)}}>
                      EDIT
                    </a>
                    <Button onClick={this.deleteUser(user.get('id'))}
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
          />
        }
      </div>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
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

