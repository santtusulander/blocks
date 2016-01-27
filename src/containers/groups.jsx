import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Button } from 'react-bootstrap';

import * as groupActionCreators from '../redux/modules/group'
import EditGroup from '../components/edit-group'
import Group from '../components/group'
import ConfigurationSidebar from '../components/configuration-sidebar'

export class Groups extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveGroupValue = this.changeActiveGroupValue.bind(this)
    this.saveActiveGroupChanges = this.saveActiveGroupChanges.bind(this)
    this.cancelActiveGroupChanges = this.cancelActiveGroupChanges.bind(this)
    this.toggleActiveGroup = this.toggleActiveGroup.bind(this)
    this.createNewGroup = this.createNewGroup.bind(this)
  }
  componentWillMount() {
    this.props.groupActions.startFetching()
    this.props.groupActions.fetchGroups(
      this.props.params.brand,
      this.props.params.account
    )
  }
  toggleActiveGroup(id) {
    return () => {
      if(this.props.activeGroup && this.props.activeGroup.get('group_id') === id){
        this.props.groupActions.changeActiveGroup(null)
      }
      else {
        this.props.groupActions.fetchGroup(
          this.props.params.brand,
          this.props.params.account,
          id
        )
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
      this.props.params.brand,
      this.props.params.account,
      this.props.activeGroup.toJS()
    )
  }
  cancelActiveGroupChanges() {
    this.props.groupActions.changeActiveGroup(null)
  }
  createNewGroup() {
    this.props.groupActions.createGroup(
      this.props.params.brand,
      this.props.params.account
    )
  }
  deleteGroup(id) {
    this.props.groupActions.deleteGroup(
      this.props.params.brand,
      this.props.params.account,
      id
    )
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
                  delete={this.deleteGroup}/>
              )}
          </tbody>
        </Table>
        <ConfigurationSidebar hidden={!activeGroup}>
          {activeGroup &&
            <div>
              <div className="configuration-sidebar-header">
                <h1>Edit Group</h1>
                <p>Lorem ipsum dolor</p>
              </div>
              <div className="configuration-sidebar-body">
                <EditGroup group={activeGroup}
                  changeValue={this.changeActiveGroupValue}
                  saveChanges={this.saveActiveGroupChanges}
                  cancelChanges={this.cancelActiveGroupChanges}/>
              </div>
            </div>
          }
        </ConfigurationSidebar>
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
