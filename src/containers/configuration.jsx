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
    this.submitForm = this.submitForm.bind(this)
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
  changeValue(path, value) {
    let activeHost = this.props.activeHost
    this.props.hostActions.changeActiveHost(
      activeHost.setIn(path, value)
    )
  }
  submitForm() {
    alert('form submitted');
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
    // const activeConfig = this.props.activeHost.get('services').get(0).find(
    //   config => config.get('version') === this.props.params.version
    // )
    const activeConfig = Immutable.fromJS({
      edge_configuration: {
        published_name: "aaa",
        origin_host_name: "bbb",
        origin_host_port: "111",
        host_header: "origin_host_name",
        origin_path_append: "ddd"
      },
      response_policies: [
        {
          defaults: {
            match: "*",
            policies: [
              {
                type: "cache",
                action: "set",
                honor_origin_cache_policies: true
              },
              {
                type: "cache",
                action: "set",
                ignore_case: false
              },
              {
                type: "cache",
                action: "set",
                honor_etags: true
              },
              {
                type: "cache",
                action: "set",
                cache_errors: "10s"
              }
            ]
          }
        }
      ]
    })

    return (
      <div className="container">

        <h1 className="page-header">Configure {this.props.params.host}</h1>
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
            saveChanges={this.submitForm}/>
          : null}

        {this.state.activeTab === 'cache' ?
          <ConfigurationCache
            config={activeConfig}
            changeValue={this.changeValue}
            saveChanges={this.submitForm}/>
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
