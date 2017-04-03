import React from 'react'
import Immutable from 'immutable'
import {FormattedMessage, injectIntl} from 'react-intl'
import { FormGroup, FormControl } from 'react-bootstrap'

import SectionHeader from '../../layout/section-header'
import RoleEditForm from './role-edit-form.jsx'
import ActionButtons from '../../action-buttons.jsx'

import TableSorter from '../../table-sorter'
import ArrayTd from '../../array-td/array-td'

class RolesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      sortBy: 'name',
      sortDir: -1
    }

    this.changeSort = this.changeSort.bind(this);
    this.labelPermissions = this.labelPermissions.bind(this);
    this.sortedData = this.sortedData.bind(this);
  }

  labelPermissions(rolePermissions, permissions) {
    const permissionNames = rolePermissions
      .map((rules, key) => {
        const permissionName = permissions
          .find(permission => permission.get('name') === key)
          .get('title')
        return permissionName
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
      if (typeof a.get(sortBy) === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if (aVal < bVal) {
        return -1 * sortDir
      }      else if (aVal > bVal) {
        return 1 * sortDir
      }
      return 0
    })
  }

  render() {
    const filteredRoles = this.props.roles
      .filter(role => role.get('name').toLowerCase().includes(this.state.search.toLowerCase()))

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const sortedRoles = this.sortedData(
      filteredRoles,
      this.state.sortBy,
      this.state.sortDir
    )

    const hiddenRoles = this.props.roles.size - sortedRoles.size

    const rolesSize = sortedRoles.size
    const rolesText = ` Role${sortedRoles.size === 1 ? '' : 's'}`
    const hiddenRolesText = hiddenRoles ? ` (${hiddenRoles} hidden)` : ''
    const finalRolesText = rolesSize + rolesText + hiddenRolesText

    return (
      <div className='roles-list'>
        <SectionHeader sectionHeaderTitle={finalRolesText}>
          <FormGroup className="search-input-group">
            <FormControl
              type="text"
              className="search-input"
              placeholder={this.props.intl.formatMessage({id: 'portal.role.list.search.placeholder'})}
              value={this.state.search}
              onChange={({ target: { value } }) => this.setState({ search: value })} />
          </FormGroup>
        </SectionHeader>
        <table className="table table-striped">
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="name"><FormattedMessage id="portal.role.list.header.role.title"/></TableSorter>
              <th><FormattedMessage id="portal.role.list.header.permissions.title"/></th>
              <th><FormattedMessage id="portal.role.list.header.assignedTo.title"/></th>
              <th width="1%" />
            </tr>
          </thead>

        <tbody>
            {!sortedRoles.isEmpty() ? sortedRoles.map((role, i) => {
              const userCount = this.props.users
                .filter(user => user.get('roles').contains(role.get('id')))
                .size

              return (
                <tr key={i}>
                  <td className={`name-${i}`}>
                    {role.get('name')}
                  </td>
                  {this.props.permissions.size ?
                    <ArrayTd maxItemsShown={5} items={[/*
                     TODO: Uncomment these when we support API permissions
                     ...this.labelPermissions(
                     role.get('permissions').get('aaa'),
                     this.props.permissions.get('aaa')
                     ).toArray(),
                     ...this.labelPermissions(
                     role.get('permissions').get('north'),
                     this.props.permissions.get('north')
                     ).toArray(),*/
                      ...this.labelPermissions(
                      role.getIn(['permissions', 'ui'], Immutable.List()).filter(permission => permission),
                      this.props.permissions.get('ui')
                      ).toArray()
                    ]} />
                    : <td>No permissions found</td>}
                  <td>
                    {userCount} User{userCount !== 1 && 's'}
                  </td>
                  <td className="nowrap-column">
                    <ActionButtons
                      onEdit={() => this.props.onEdit(role.get('id'))}/>
                  </td>
                </tr>
              );
            }) :
              <tr id="empty-msg">
                <td colSpan="6">
                {this.state.search.length > 0 ?
                  <FormattedMessage id="portal.role.list.search.noResultsWithTerm.text" values={{searchTerm: this.state.search}}/> :
                  <FormattedMessage id="portal.role.list.search.noResults.text"/>}
                </td>
              </tr>}
          </tbody>
        </table>

        {this.props.showAddNewDialog &&
          <RoleEditForm
            permissions={this.props.permissions}
            roles={this.props.roles}
            editRole={this.props.editRole}
            show={this.props.showAddNewDialog}
            onCancel={this.props.onCancel}
            onSave={this.props.onSave}/>
        }

      </div>
    )
  }
}
RolesList.displayName  = 'RolesList'
RolesList.propTypes = {
  editRole: React.PropTypes.object,
  intl: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onSave: React.PropTypes.func,
  permissions: React.PropTypes.instanceOf(Immutable.Map),
  roles: React.PropTypes.instanceOf(Immutable.List),
  showAddNewDialog: React.PropTypes.bool,
  users: React.PropTypes.instanceOf(Immutable.List)
}
RolesList.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.List(),
  users: Immutable.List()
}

export default injectIntl(RolesList)
