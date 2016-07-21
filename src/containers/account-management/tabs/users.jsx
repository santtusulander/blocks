import React from 'react'
import { List, fromJS } from 'immutable'
import { Table, Button, Row, Col, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'
import * as uiActionCreators from '../../../redux/modules/ui'

import IconAdd from '../../../components/icons/icon-add.jsx'
import IconTrash from '../../../components/icons/icon-trash.jsx'
import TableSorter from '../../../components/table-sorter'
import AddUserForm from '../../../components/account-management/add-user-form'

export class AccountManagementAccountUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'email',
      sortDir: 1,
      showAddItemModal: false
    }

    this.changeSort = this.changeSort.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.addUser = this.addUser.bind(this)
  }
  componentWillMount() {
    const { brand, account, group } = this.props.params
    this.props.userActions.fetchUsers(brand, account, group)

    if (!this.props.groups.toJS().length) {
      this.props.groupActions.fetchGroups(brand, account);
    }
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

    this.props.groups.forEach((group, i) => {
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
  addUser() {
    this.setState({
      showAddItemModal: true
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
              onClick={this.addUser}>
              <IconAdd />
            </Button>
          </Col>
        </Row>
        <Table striped={true}>
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="email">
                Email
              </TableSorter>
              <th>Password</th>
              <th>Role</th>
              <th>Groups</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
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
        <AddUserForm
          show={this.state.showAddItemModal}
          dialogClassName="configuration-sidebar"
          onCancel={() => {
            this.setState({ showAddItemModal: false })
          }}/>
      </div>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
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
    uiActions: bindActionCreators(uiActionCreators, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagementAccountUsers))

