import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as hostActionCreators from '../redux/modules/host'

import ConfigurationDetails from '../components/configuration/details'
import ConfigurationCache from '../components/configuration/cache'
import ConfigurationPerformance from '../components/configuration/performance'
import ConfigurationSecurity from '../components/configuration/security'
import ConfigurationCertificates from '../components/configuration/certificates'
import ConfigurationChangeLog from '../components/configuration/change-log'

export class Configuration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'details'
    }

    this.changeValue = this.changeValue.bind(this)
    this.saveActiveHostChanges = this.saveActiveHostChanges.bind(this)
    this.activateTab = this.activateTab.bind(this)
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
    return this.props.activeHost.get('services').get(0).get('configurations').find(
      config => {
        return config.get('config_id') === this.props.params.version
      }
    )
  }
  changeValue(path, value) {
    const hostIndex = this.props.activeHost.get('services').get(0).get('configurations').findIndex(
      config => {
        return config.get('config_id') === this.props.params.version
      }
    )

    this.props.hostActions.changeActiveHost(
      this.props.activeHost.setIn(
        ['services', 0, 'configurations', hostIndex],
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
    return e => {
      e.preventDefault()
      this.setState({activeTab: tabName})
    }
  }
  render() {
    if(this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <div className="container">Loading...</div>
    }
    const activeConfig = this.props.activeHost.get('services').get(0).get('configurations').find(
      config => {
        return config.get('config_id') === this.props.params.version
      }
    )

    return (
      <div className="container">

        <h1 className="page-header">{this.props.params.host}</h1>
        <a href="#" className="config-tab"
          onClick={this.activateTab('details')}>
          Details
        </a>
        <a href="#" className="config-tab"
          onClick={this.activateTab('cache')}>
          Cache
        </a>
        <a href="#" className="config-tab"
          onClick={this.activateTab('performance')}>
          Performance
        </a>
        <a href="#" className="config-tab"
          onClick={this.activateTab('security')}>
          Security
        </a>
        <a href="#" className="config-tab"
          onClick={this.activateTab('certificates')}>
          Certificates
        </a>
        <a href="#" className="config-tab"
          onClick={this.activateTab('change-log')}>
          Change Log
        </a>
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
