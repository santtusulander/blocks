import React from 'react'
import Immutable from 'immutable'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { formatUnixTimestamp} from '../../../util/helpers'

import IconAdd from '../../icons/icon-add.jsx'
import IconTrash from '../../icons/icon-trash.jsx'
import TableSorter from '../../table-sorter'
import EditGroup from './edit-group'

class AccountManagementAccountGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      editing: null,
      sortBy: 'name',
      sortDir: 1
    }

    this.addGroup        = this.addGroup.bind(this)
    this.changeSort      = this.changeSort.bind(this)
    this.deleteGroup     = this.deleteGroup.bind(this)
    this.editGroup       = this.editGroup.bind(this)
    this.sortedData      = this.sortedData.bind(this)
    this.saveEditedGroup = this.saveEditedGroup.bind(this)
    this.saveNewGroup    = this.saveNewGroup.bind(this)
    this.cancelAdding    = this.cancelAdding.bind(this)
  }

  componentDidMount() {
    window.addEventListener('click', this.cancelAdding)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.cancelAdding)
  }

  cancelAdding() {
    this.setState({
      adding: false,
      editing: null
    })
  }

  addGroup(e) {
    e.stopPropagation()
    this.setState({ adding: true })
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  deleteGroup(group) {
    return () => this.props.deleteGroup(group)
  }

  editGroup(group) {
    return (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.setState({ editing: group })
    }
  }

  saveEditedGroup(group) {
    return name => this.props.editGroup(group, name).then(this.cancelAdding)
  }

  saveNewGroup(name) {
    this.props.addGroup(name).then(this.cancelAdding)
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
    const sorterProps  = {
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
              {/* Not on 0.7
              <th>Properties</th>
              */}
              <th></th>
            </tr>
          </thead>
          <tbody>
          {this.state.adding && <EditGroup save={this.saveNewGroup}/>}
          {sortedGroups.map((group, i) => {
            if(group.get('id') === this.state.editing) {
              return (
                <EditGroup key={i}
                  name={group.get('name')}
                  save={this.saveEditedGroup(group.get('id'))}/>
              )
            }
            return (
              <tr key={i}>
                <td>{group.get('name')}</td>
                <td>{formatUnixTimestamp(group.get('created'))}</td>
                {/* Not on 0.7
                <td>NEEDS_API</td>
                */}
                <td>
                  <a href="#" onClick={this.editGroup(group.get('id'))}>
                    EDIT
                  </a>
                  <Button onClick={this.deleteGroup(group)}
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

AccountManagementAccountGroups.displayName  = 'AccountManagementAccountGroups'
AccountManagementAccountGroups.propTypes    = {
  addGroup: React.PropTypes.func,
  deleteGroup: React.PropTypes.func,
  editGroup: React.PropTypes.func,
  groups: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementAccountGroups.defaultProps = {
  groups: Immutable.List([])
}

module.exports = AccountManagementAccountGroups
