import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Nav, NavItem} from 'react-bootstrap'

import * as hostActionCreators from '../redux/modules/host'

import ConfigurationDetails from '../components/configuration/details'
import ConfigurationCache from '../components/configuration/cache'
import ConfigurationPerformance from '../components/configuration/performance'
import ConfigurationSecurity from '../components/configuration/security'
import ConfigurationCertificates from '../components/configuration/certificates'
import ConfigurationChangeLog from '../components/configuration/change-log'
import ConfigurationVersions from '../components/configuration/versions'

export class Configuration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'details',
      activeConfig: 0
    }

    this.changeValue = this.changeValue.bind(this)
    this.saveActiveHostChanges = this.saveActiveHostChanges.bind(this)
    this.activateTab = this.activateTab.bind(this)
    this.activateVersion = this.activateVersion.bind(this)
    this.deleteVersion = this.deleteVersion.bind(this)
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
  getActiveConfig() {
    return this.props.activeHost.get('services').get(0).get('configurations').get(this.state.activeConfig)
  }
  changeValue(path, value) {
    this.props.hostActions.changeActiveHost(
      this.props.activeHost.setIn(
        ['services', 0, 'configurations', this.state.activeConfig],
        this.getActiveConfig().setIn(path, value)
      )
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
  activateTab(tabName) {
    this.setState({activeTab: tabName})
  }
  activateVersion(index) {
    this.setState({activeConfig: index})
  }
  deleteVersion(id) {
    this.props.hostActions.deleteConfiguration(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.host,
      id
    )
  }
  createNewVersion(id) {
    this.props.hostActions.createConfiguration(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.host,
      id
    )
  }
  render() {
    if(this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <div className="container">Loading...</div>
    }
    const activeConfig = this.getActiveConfig()

    return (
      <div className="container">
        {/*<AddConfiguration createConfiguration={this.createNewConfiguration}/>*/}

        <h1 className="page-header">{this.props.params.host}</h1>

        <ConfigurationVersions
          fetching={this.props.fetching}
          configurations={this.props.activeHost.get('services').get(0).get('configurations')}
          delete={this.deleteVersion}
          activate={this.activateVersion}/>

        <Nav bsStyle="tabs" activeKey={this.state.activeTab}
          onSelect={this.activateTab}>
          <NavItem eventKey={'details'}>
            Details
          </NavItem>
          <NavItem eventKey={'cache'}>
            Cache
          </NavItem>
          <NavItem eventKey={'performance'}>
            Performance
          </NavItem>
          <NavItem eventKey={'security'}>
            Security
          </NavItem>
          <NavItem eventKey={'certificates'}>
            Certificates
          </NavItem>
          <NavItem eventKey={'change-log'}>
            Change Log
          </NavItem>
        </Nav>
        {this.state.activeTab === 'details' ?
          <ConfigurationDetails
            edgeConfiguration={activeConfig.get('edge_configuration')}
            changeValue={this.changeValue}
            saveChanges={this.saveActiveHostChanges}/>
          : null}

        {this.state.activeTab === 'cache' ?
          <ConfigurationCache
            config={activeConfig}
            changeValue={this.changeValue}
            saveChanges={this.saveActiveHostChanges}/>
          : null}

        {this.state.activeTab === 'performance' ?
          <ConfigurationPerformance/>
          : null}

        {this.state.activeTab === 'security' ?
          <ConfigurationSecurity/>
          : null}

        {this.state.activeTab === 'certificates' ?
          <ConfigurationCertificates/>
          : null}

        {this.state.activeTab === 'change-log' ?
          <ConfigurationChangeLog/>
          : null}

      </div>
    );
  }
}

Configuration.displayName = 'Configuration'
Configuration.propTypes = {
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeHost: state.host.get('activeHost'),
    fetching: state.host.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
