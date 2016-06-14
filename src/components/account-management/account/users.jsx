import React from 'react'
import Immutable from 'immutable'
import {Table, Button, Row, Col} from 'react-bootstrap'

import IconAdd from '../../icons/icon-add.jsx'
import IconTrash from '../../icons/icon-trash.jsx'
import TableSorter from '../../table-sorter'

class AccountManagementAccountUsers extends React.Component {
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
              <TableSorter {...sorterProps} column="name">
                Name
              </TableSorter>
              <th>Created On</th>
              <th>Properties</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, i) => {
              return (
                <tr key={i}>
                  <td>
                    {user.get('name')}
                  </td>
                  <td>
                    NEEDS_API
                  </td>
                  <td>
                    NEEDS_API
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
