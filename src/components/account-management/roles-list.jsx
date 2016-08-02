import React from 'react'
import Immutable from 'immutable'

import { AccountManagementHeader } from './account-management-header.jsx'
import RolesEditForm from './role-edit-form.jsx'
import ActionLinks from './action-links.jsx'

import TableSorter from '../table-sorter'
import ArrayTd from '../array-td/array-td'

import './roles-list.scss';

class RolesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'name',
      sortDir: -1
    }

    this.changeSort = this.changeSort.bind(this);
    this.labelPermissions = this.labelPermissions.bind(this);
    this.sortedData = this.sortedData.bind(this);
  }

  labelPermissions(rolePermissions, permissions, section) {
    let permissionNames = rolePermissions
      .map((rules, key) => {
        let permissionName = permissions
          .find(permission => permission.get('name') === key)
          .get('title')
        return `${section}: ${permissionName} (${key})`
      })
    return permissionNames;
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
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
    if (!this.props.roles || this.props.roles.size === 0) {
      return (
        <div id="empty-msg">
          <p>No roles found</p>
        </div>
      )
    }

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedRoles = this.sortedData(
      this.props.roles,
      this.state.sortBy,
      this.state.sortDir
    )

    return (
      <div className='roles-list'>

        <AccountManagementHeader
          title={`${this.props.roles.count() } Roles`}/>

        <table className="table table-striped">
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="name">Role</TableSorter>
              <th>Permissions</th>
              <th>Assigned To</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {sortedRoles.map( (role, i) => {
              return (
                <tr className='roles-list-row' key={i}>
                  <td>
                    {role.get('name')}
                  </td>
                  <ArrayTd items={[
                    ...this.labelPermissions(
                      role.get('permissions').get('aaa'),
                      this.props.permissions.get('aaa'),
                      'AAA'
                    ).toArray(),
                    ...this.labelPermissions(
                      role.get('permissions').get('north'),
                      this.props.permissions.get('north'),
                      'North'
                    ).toArray(),
                    ...this.labelPermissions(
                      role.get('permissions').get('ui'),
                      this.props.permissions.get('ui'),
                      'UI'
                    ).toArray()
                  ]} />
                  <td>
                    NEEDS API
                  </td>
                  <td>
                    <ActionLinks
                      onEdit={() => this.props.onEdit(role.get('id'))}
                      onDelete={() => this.props.onDelete(role.get('id'))}/>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

        {this.props.showAddNewDialog ?
          <RolesEditForm
            permissions={this.props.permissions}
            roles={this.props.roles}
            editRole={this.props.editRole}
            show={this.props.showAddNewDialog}
            onCancel={this.props.onCancel}
            onSave={this.props.onSave}/>
        : null}

      </div>
    )
  }
}
RolesList.displayName  = 'RolesList'
RolesList.propTypes = {
  editRole: React.PropTypes.object,
  onAdd: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onSave: React.PropTypes.func,
  permissions: React.PropTypes.instanceOf(Immutable.Map),
  roles: React.PropTypes.instanceOf(Immutable.List),
  showAddNewDialog: React.PropTypes.bool
}
RolesList.defaultProps = {
  permissions: Immutable.List([]),
  roles: Immutable.List([])
}

module.exports = RolesList
