import React from 'react'
import Immutable from 'immutable'
import {Table, Button, Row, Col} from 'react-bootstrap'

import IconAdd from '../../icons/icon-add.jsx'
import IconTrash from '../../icons/icon-trash.jsx'
import TableSorter from '../../table-sorter'

class AccountManagementAccountGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'name',
      sortDir: 1
    }

    this.addGroup = this.addGroup.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.deleteGroup = this.deleteGroup.bind(this)
    this.editGroup = this.editGroup.bind(this)
    this.sortedData = this.sortedData.bind(this)
  }
  addGroup() {
    console.log('add group')
  }
  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }
  deleteGroup(group) {
    return () => console.log('delete group '+group)
  }
  editGroup(group) {
    return (e) => {
      e.preventDefault()
      console.log('edit group '+group)
    }
  }
  sortedData(data, sortBy, sortDir) {
    return data.sort((a, b) => {
      if(a.get(sortBy) < b.get(sortBy)) {
        return -1 * sortDir
      }
      else if(a.get(sortBy) > b.get(sortBy)) {
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
    const sortedGroups = this.sortedData(
      this.props.groups,
      this.state.sortBy,
      this.state.sortDir
    )
    return (
      <div className="account-management-account-groups">
        <Row className="header-btn-row">
          <Col sm={8}>
            <h3>
              {this.props.groups.size} Group{this.props.groups.size === 1 ? '' : 's'}
            </h3>
          </Col>
          <Col sm={4} className="text-right">
            <Button bsStyle="success" className="btn-icon btn-add-new"
              onClick={this.addGroup}>
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
            {sortedGroups.map((group, i) => {
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
                    <a href="#" onClick={this.editGroup(group.get('id'))}>
                      EDIT
                    </a>
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
