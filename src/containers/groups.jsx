import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Modal, Button } from 'react-bootstrap';

import * as groupActionCreators from '../redux/modules/group'
import EditGroup from '../components/edit-group'

const Group = group =>
  <tr onClick={group.toggleActive}>
    <td>{group.id}</td>
    <td>{group.name}</td>
    <td>{group.description}</td>
    <td>
      <a href="#" onClick={group.delete}>Delete</a>
    </td>
  </tr>
Group.displayName = "Group"

export class Groups extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveGroupValue = this.changeActiveGroupValue.bind(this)
    this.saveActiveGroupChanges = this.saveActiveGroupChanges.bind(this)
    this.toggleActiveGroup = this.toggleActiveGroup.bind(this)
    this.createNewGroup = this.createNewGroup.bind(this)
  }
  componentWillMount() {
    this.props.groupActions.startFetching()
    this.props.groupActions.fetchGroups('udn', this.props.params.account)
  }
  toggleActiveGroup(id) {
    return () => {
      if(this.props.activeGroup && this.props.activeGroup.get('group_id') === id){
        this.props.groupActions.changeActiveGroup(null)
      }
      else {
        this.props.groupActions.fetchGroup('udn', this.props.params.account, id)
      }
    }
  }
  changeActiveGroupValue(valPath, value) {
    this.props.groupActions.changeActiveGroup(
      this.props.activeGroup.setIn(valPath, value)
    )
  }
  saveActiveGroupChanges() {
    this.props.groupActions.updateGroup(
      'udn', this.props.params.account, this.props.activeGroup.toJS()
    )
  }
  createNewGroup() {
    this.props.groupActions.createGroup('udn', this.props.params.account)
  }
  deleteGroup(id) {
    this.props.groupActions.deleteGroup('udn', this.props.params.account, id)
  }
  render() {
    const activeGroup = this.props.activeGroup
    return (
      <div className="container">
        <h1 className="page-header">Groups</h1>
        <Button onClick={this.createNewGroup}>Add New</Button>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="4">Loading...</td></tr> :
              this.props.groups.map((group, i) =>
                <Group key={i} id={group}
                  name="Name" description="Desc"
                  toggleActive={this.toggleActiveGroup(group)}
                  delete={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    this.deleteGroup(group)
                  }}/>
              )}
          </tbody>
        </Table>
        {activeGroup ?
          <Modal show={true}
            onHide={this.toggleActiveGroup(activeGroup.get('group_id'))}>
            <Modal.Header closeButton={true}>
              <Modal.Title>Edit Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditGroup group={activeGroup}
                changeValue={this.changeActiveGroupValue}
                saveChanges={this.saveActiveGroupChanges}/>
            </Modal.Body>
          </Modal> : null
        }
      </div>
    );
  }
}

Groups.displayName = 'Groups'
Groups.propTypes = {
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeGroup: state.group.get('activeGroup'),
    groups: state.group.get('allGroups'),
    fetching: state.group.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    groupActions: bindActionCreators(groupActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
