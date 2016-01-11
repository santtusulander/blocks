import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table } from 'react-bootstrap';

import * as hostActionCreators from '../redux/modules/host'
// import AddConfiguration from '../components/add-configuration'
// import Configuration from '../components/configuration'

export class Configurations extends React.Component {
  constructor(props) {
    super(props);

    this.createNewConfiguration = this.createNewConfiguration.bind(this)
    this.deleteConfiguration = this.deleteConfiguration.bind(this)
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.host
    )
  }
  createNewConfiguration(id) {
    this.props.hostActions.createConfiguration(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.host,
      id
    )
  }
  deleteConfiguration(id) {
    this.props.hostActions.deleteConfiguration(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.host,
      id
    )
  }
  render() {
    return (
      <div className="container">
        <h1 className="page-header">Configurations</h1>
        {/*<AddConfiguration createConfiguration={this.createNewConfiguration}/>*/}
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
              this.props.configurations.map((configuration, i) =>
                <tr key={i}><td colSpan="4">Configuration</td></tr>
              )}
          </tbody>
        </Table>
      </div>
    );
  }
}

Configurations.displayName = 'Configurations'
Configurations.propTypes = {
  configurations: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  let activeHosts = state.host.get('activeHost')
  let configs = Immutable.List()
  if(activeHosts) {
    configs = activeHosts.get('services').get(0).get('configurations')
  }
  return {
    configurations: configs,
    fetching: state.host.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Configurations);
