import React from 'react'
import Immutable from 'immutable'
import {Table, Button} from 'react-bootstrap'

import IconTrash from '../../icons/icon-trash.jsx'
import TableSorter from '../../table-sorter'

class AccountManagementAccountGroups extends React.Component {
  deleteGroup(group) {
    console.log('delete group '+group)
  }
  render() {
    return (
      <div className="account-management-account-groups">
        <h2>
          {this.props.groups.size} Group{this.props.groups.size === 1 ? '' : 's'}
        </h2>
        <Table striped={true}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created On</th>
              <th>Properties</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.groups.map((group, i) => {
              return (
                <tr key={i}>
                  <td>
                    {group.get('name')}
                  </td>
                  <td>
                    NEEDS_API
                  </td>
                  <td>
                    NEEDS_API
                  </td>
                  <td>
                    <a href="#">EDIT</a>
                    <Button onClick={this.deleteGroup(group.get('id'))}
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

AccountManagementAccountGroups.displayName = 'AccountManagementAccountGroups'
AccountManagementAccountGroups.propTypes = {
  groups: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementAccountGroups.defaultProps = {
  groups: Immutable.List([])
}

module.exports = AccountManagementAccountGroups
