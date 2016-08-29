import React from 'react'
import Immutable from 'immutable'
import { Button, Row, Col, Input } from 'react-bootstrap'

import { AccountManagementHeader } from './account-management-header.jsx'
import RolesEditForm from './role-edit-form.jsx'
import ActionLinks from './action-links.jsx'

import TableSorter from '../table-sorter'
import ArrayTd from '../array-td/array-td'

import './roles-list.scss';

import {FormattedMessage, formatMessage, injectIntl} from 'react-intl'

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
    let permissionNames = rolePermissions
      .map((rules, key) => {
        let permissionName = permissions
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

    return (
      <div className='roles-list'>
        <Row className="header-btn-row">
          <Col sm={6}>
            <h3>
              {sortedRoles.size} Role{sortedRoles.size === 1 ? '' : 's'} {!!hiddenRoles && `(${hiddenRoles} hidden)`}
            </h3>
          </Col>
          <Col sm={6} className="text-right">
            <Input
            type="text"
            className="search-input"
            groupClassName="search-input-group"
            placeholder={this.props.intl.formatMessage({id: 'portal.role.list.search.placeholder'})}
            value={this.state.search}
            onChange={({ target: { value } }) => this.setState({ search: value })} />
          </Col>
        </Row>

        <table className="table table-striped">
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="name"><FormattedMessage id="portal.role.list.header.role.title"/></TableSorter>
              <th><FormattedMessage id="portal.role.list.header.permissions.title"/></th>
              <th><FormattedMessage id="portal.role.list.header.assignedTo.title"/></th>
              <th width="1%"></th>
            </tr>
          </thead>

        <tbody>
            { !sortedRoles.isEmpty() ? sortedRoles.map((role, i) => {
              const userCount = this.props.users
                .filter(user => user.get('roles').contains(role.get('id')))
                .size

              return (
                <tr className='roles-list-row' key={i}>
                  <td>
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
                      role.get('permissions').get('ui').filter(permission => permission),
                      this.props.permissions.get('ui')
                      ).toArray()
                      ]} />
                    : <td>No permissions found</td>}
                  <td>
                    {userCount} User{userCount !== 1 && 's'}
                  </td>
                  <td>
                    <ActionLinks
                    onEdit={() => this.props.onEdit(role.get('id'))}
                    onDelete={() => this.props.onDelete(role.get('id'))}/>
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
  showAddNewDialog: React.PropTypes.bool,
  users: React.PropTypes.instanceOf(Immutable.List)
}
RolesList.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.List(),
  users: Immutable.List()
}

module.exports = injectIntl(RolesList)
