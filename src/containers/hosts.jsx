import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Modal } from 'react-bootstrap';

import * as hostActionCreators from '../redux/modules/host'
import AddHost from '../components/add-host'
// import EditHost from '../components/edit-host'

const Host = host =>
  <tr onClick={host.toggleActive}>
    <td>{host.id}</td>
    <td>{host.name}</td>
    <td>{host.description}</td>
    <td>
      <a href="#" onClick={host.delete}>Delete</a>
    </td>
  </tr>
Host.displayName = "Host"

export class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveHostValue = this.changeActiveHostValue.bind(this)
    this.saveActiveHostChanges = this.saveActiveHostChanges.bind(this)
    this.toggleActiveHost = this.toggleActiveHost.bind(this)
    this.createNewHost = this.createNewHost.bind(this)
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHosts(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
  }
  toggleActiveHost(id) {
    return () => {
      if(this.props.activeHost && this.props.activeHost.get('host_id') === id){
        this.props.hostActions.changeActiveHost(null)
      }
      else {
        this.props.hostActions.fetchHost(
          this.props.params.brand,
          this.props.params.account,
          this.props.params.group,
          id
        )
      }
    }
  }
  changeActiveHostValue(valPath, value) {
    this.props.hostActions.changeActiveHost(
      this.props.activeHost.setIn(valPath, value)
    )
  }
  saveActiveHostChanges() {
    this.props.hostActions.updateHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.activeHost.toJS()
    )
  }
  createNewHost(id) {
    this.props.hostActions.createHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
  }
  deleteHost(id) {
    this.props.hostActions.deleteHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
  }
  render() {
    const activeHost = this.props.activeHost
    return (
      <div className="container">
        <h1 className="page-header">Hosts</h1>
        <AddHost createHost={this.createNewHost}/>
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
              this.props.hosts.map((host, i) =>
                <Host key={i} id={host}
                  name="Name" description="Desc"
                  toggleActive={this.toggleActiveHost(host)}
                  delete={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    this.deleteHost(host)
                  }}/>
              )}
          </tbody>
        </Table>
        {activeHost ?
          <Modal show={true}
            onHide={this.toggleActiveHost(activeHost.get('host_id'))}>
            <Modal.Header closeButton={true}>
              <Modal.Title>Edit Host</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/*<EditHost host={activeHost}
                changeValue={this.changeActiveHostValue}
                saveChanges={this.saveActiveHostChanges}/>*/}
            </Modal.Body>
          </Modal> : null
        }
      </div>
    );
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeHost: state.host.get('activeHost'),
    hosts: state.host.get('allHosts'),
    fetching: state.host.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
