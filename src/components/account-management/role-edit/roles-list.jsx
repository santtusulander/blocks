import React from 'react'
import Immutable from 'immutable'
import {FormattedMessage, injectIntl} from 'react-intl'
import { FormGroup, FormControl } from 'react-bootstrap'

import SectionHeader from '../../shared/layout/section-header'
import RoleEditForm from './role-edit-form.jsx'
import ActionButtons from '../../shared/action-buttons.jsx'

import TableSorter from '../../shared/table-sorter'
import ArrayTd from '../../shared/page-elements/array-td'
import IsAllowed from '../../shared/permission-wrappers/is-allowed'
import { MODIFY_ROLE } from '../../../constants/permissions'

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
      } else if (aVal > bVal) {
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

    const rolesText = this.props.intl.formatMessage({id: 'portal.role.list.counter.text' }, { numRoles: sortedRoles.size })
    const hiddenRolesText = hiddenRoles ? ` (${hiddenRoles} hidden)` : ''
    const finalRolesText = rolesText + hiddenRolesText

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
              <IsAllowed to={MODIFY_ROLE}>
                <th width="1%" />
              </IsAllowed>
            </tr>
          </thead>

        <tbody>
            {!sortedRoles.isEmpty() ? sortedRoles.map((role, i) => {
              return (
                <tr key={i}>
                  <td className={`name-${i}`}>
                    {role.get('name')}
                  </td>
                  {this.props.permissions.size ?
                    <ArrayTd maxItemsShown={5} items={[
                      ...this.labelPermissions(
                      role.getIn(['permissions', 'ui'], Immutable.List()).filter(permission => permission),
                      this.props.permissions.getIn(['UI','resources'])
                      ).toArray()
                    ]} />
                    : (
                      <td>
                        <FormattedMessage id="portal.role.list.search.noPermissionsResults.text"/>
                      </td>
                    )}
                  <IsAllowed to={MODIFY_ROLE}>
                    <td className="nowrap-column">
                      <ActionButtons
                        onEdit={() => this.props.onEdit(role.get('id'))}/>
                    </td>
                  </IsAllowed>
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
  showAddNewDialog: React.PropTypes.bool
}
RolesList.defaultProps = {
  permissions: Immutable.Map(),
  roles: Immutable.List()
}

export default injectIntl(RolesList)
