import React from 'react'
import Immutable from 'immutable'
import { Input, Table, Button, Row, Col } from 'react-bootstrap'
import { formatUnixTimestamp} from '../../../util/helpers'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'

import IconAdd from '../../../components/icons/icon-add'
import IconTrash from '../../../components/icons/icon-trash'
import TableSorter from '../../../components/table-sorter'
import InlineAdd from '../../../components/inline-add'
import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'

class AccountManagementAccountGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      editing: null,
      newName: '',
      newUsers: Immutable.List(),
      search: '',
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
    this.changeSearch    = this.changeSearch.bind(this)
    this.changeNewName   = this.changeNewName.bind(this)
    this.changeNewUsers  = this.changeNewUsers.bind(this)
  }
  componentWillMount() {
    const { brand, account } = this.props.params
    this.props.userActions.fetchUsers(brand, account)

    if (!this.props.groups.toJS().length) {
      this.props.groupActions.fetchGroups(brand, account);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.account !== this.props.params.account) {
      const { brand, account } = nextProps.params
      this.props.userActions.fetchUsers(brand, account)
    }
  }

  cancelAdding() {
    this.setState({
      adding: false,
      editing: null
    })
  }

  addGroup(e) {
    e.stopPropagation()
    this.setState({
      adding: true,
      newName: '',
      newUsers: Immutable.List()
    })
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  // TODO: Now that this is a container, no need to pass this in
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

  // TODO: Now that this is a container, no need to pass this in
  saveEditedGroup(group) {
    return name => this.props.editGroup(group, name).then(this.cancelAdding)
  }

  // TODO: Now that this is a container, no need to pass this in
  saveNewGroup() {
    this.props.addGroup(this.state.newName)
      .then(newGroup => {
        return Promise.all(this.state.newUsers.map(email => {
          const foundUser = this.props.users
            .find(user => user.get('email') === email)
          const newUser = {
            group_id: foundUser.get('group_id').push(newGroup.id).toJS()
          }
          return this.props.userActions.updateUser(email, newUser)
        }))
      })
      .then(this.cancelAdding)
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

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  changeNewName(e) {
    this.setState({
      newName: e.target.value
    })
  }

  changeNewUsers(val) {
    this.setState({newUsers: val})
  }

  render() {
    const groups = this.props.groups;
    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const filteredGroups = groups.filter((group) => {
      return group.get('name').toLowerCase().includes(this.state.search.toLowerCase())
    })
    const sortedGroups = this.sortedData(
      filteredGroups,
      this.state.sortBy,
      this.state.sortDir
    )
    const numHiddenGroups = this.props.groups.size - sortedGroups.size;

    const inlineAddInputs = [
      [
        {
          input: <Input id='name' placeholder=" Name" type="text"
            onChange={this.changeNewName}
            value={this.state.newName}/>,
          positionClass: 'left'
        }
      ],
      [
        {
          input: <FilterChecklistDropdown
            id='members'
            values={this.state.newUsers}
            handleCheck={this.changeNewUsers}
            options={this.props.users.map(user => Immutable.Map({
              label: user.get('email') || 'No Email',
              value: user.get('email')
            }))}/>,
          positionClass: 'left'
        }
      ],
      [],
      []
    ]
    return (
      <div className="account-management-account-groups">
        <Row className="header-btn-row">
          <Col sm={6}>
            <h3>
              {sortedGroups.size} Group{sortedGroups.size === 1 ? '' : 's'} {!!numHiddenGroups && `(${numHiddenGroups} hidden)`}
            </h3>
          </Col>
          <Col sm={6} className="text-right">
            <Input
              type="text"
              className="search-input"
              groupClassName="search-input-group"
              placeholder="Search"
              value={this.state.search}
              onChange={this.changeSearch} />
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
              <th width="20%">Members</th>
              <TableSorter {...sorterProps} column="created">
                Created On
              </TableSorter>
              {/* Not on 0.7
              <th>Properties</th>
              */}
              <th width="1%"></th>
            </tr>
          </thead>
          <tbody>
          {this.state.adding && <InlineAdd
            validate={this.validateInlineAdd}
            fields={['name', 'members']}
            inputs={inlineAddInputs}
            cancel={this.cancelAdding}
            unmount={this.cancelAdding}
            save={this.saveNewGroup}/>}
          {sortedGroups.map((group, i) => {
            const userEmails = this.props.users
              .filter(user => user.get('group_id') &&
                user.get('group_id').size &&
                user.get('group_id').includes(group.get('id'))
              )
              .map(user => user.get('email'))
            return (
              <tr key={i}>
                <td>{group.get('name')}</td>
                <td>{userEmails.size ? userEmails.join(', ') : 'No members'}</td>
                <td>{formatUnixTimestamp(group.get('created'))}</td>
                {/* Not on 0.7
                <td>NEEDS_API</td>
                */}
                <td>
                  <a href="#" onClick={() => this.props.editGroup(group)}>
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

        {
          sortedGroups.size === 0 &&
          this.state.search.length > 0 &&
          <div className="text-center">No groups found with the search term "{this.state.search}"</div>
        }
      </div>
    )
  }
}

AccountManagementAccountGroups.displayName  = 'AccountManagementAccountGroups'
AccountManagementAccountGroups.propTypes    = {
  addGroup: React.PropTypes.func,
  deleteGroup: React.PropTypes.func,
  editGroup: React.PropTypes.func,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  toggleModal: React.PropTypes.func,
  userActions: React.PropTypes.object,
  users: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementAccountGroups.defaultProps = {
  groups: Immutable.List(),
  users: Immutable.List()
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
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagementAccountGroups))
