import React from 'react'
import { Link } from 'react-router'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table } from 'react-bootstrap';

import * as hostActionCreators from '../redux/modules/host'
import AddHost from '../components/add-host'

const Host = host =>
  <tr onClick={host.toggleActive}>
    <td>{host.id}</td>
    <td>{host.name}</td>
    <td>{host.description}</td>
    <td>
      <Link to={`/configure/${host.brand}/${host.account}/${host.group}/${host.id}`}>
        Configure
      </Link> <a href="#" onClick={host.delete}>Delete</a>
    </td>
  </tr>
Host.displayName = "Host"

export class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.createNewHost = this.createNewHost.bind(this)
    this.deleteHost = this.deleteHost.bind(this)
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHosts(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
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
                  brand={this.props.params.brand}
                  account={this.props.params.account}
                  group={this.props.params.group}
                  delete={(e) => {
                    e.preventDefault()
                    this.deleteHost(host)
                  }}/>
              )}
          </tbody>
        </Table>
      </div>
    );
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  fetching: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
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
