import React from 'react'
import Immutable from 'immutable'
import {Table, Button, Row, Col, Input} from 'react-bootstrap'

import InlineAdd from '../../inline-add.jsx'
import IconAdd from '../../icons/icon-add.jsx'
import IconTrash from '../../icons/icon-trash.jsx'
import TableSorter from '../../table-sorter'

const fakeUsers = Immutable.fromJS([
  { id: '1', name: 'Name 1', role: 'Role 1', group: 'Group 1' },
  { id: '2', name: 'Name 2', role: 'Role 2', group: 'Group 2' },
  { id: '3', name: 'Name 3', role: 'Role 3', group: 'Group 3'}
]);

/**
 * The style-field is meant for positional styling of the element.
 */
const addRowInputs = [
  [ { input: <Input id='a' type="text"/> }, { input: <Input type="text"/> } ],
  [
    { input: <Input id='b' type="text"/>, style: { float: 'left' } },
    { input: <Input id='c' type="text"/>, style: { float: 'right' } }
  ],
  []
]

class AccountManagementAccountUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'name',
      sortDir: 1
    }

    this.changeSort = this.changeSort.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.sortedData = this.sortedData.bind(this)
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
  render() {
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedUsers = this.sortedData(
      fakeUsers,
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
              <TableSorter {...sorterProps} column="name">
                Name
              </TableSorter>
              <th>Role</th>
              <th>Groups</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
             <InlineAdd
              validate={({ a }) => {
                let errors = {}
                if( a && a.length > 3) {
                  errors.a = 'no go'
                }
                return errors
              }}
              fields={['a', 'b', 'c']}
              inputs={addRowInputs}
              cancel={() => {}}
              save={vals => console.log(vals)}/>
            {sortedUsers.map((user, i) => {
              return (
                <tr key={i}>
                  <td>
                    {user.get('name')}
                  </td>
                  <td>
                    {user.get('role')}
                  </td>
                  <td>
                    {user.get('group')}
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
      </div>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
  users: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementAccountUsers.defaultProps = {
  users: Immutable.List([])
}

module.exports = AccountManagementAccountUsers
