import React from 'react'
import Immutable from 'immutable'

import Version from './version'

function versionFactory(configuration, i) {
  const id = configuration.get('config_id')
  return (
    <Version key={i}
      activate={this.activate(id)}
      label={configuration.get('label') || id}/>
  )
}

export class ConfigurationVersions extends React.Component {
  constructor(props) {
    super(props);

    this.activate = this.activate.bind(this)
  }
  activate(id) {
    return () => {
      this.props.activate(id)
    }
  }
  render() {
    if(this.props.fetching) {
      return <div>Loading...</div>
    }
    let highestAttainment = 'In Process'
    const configs = this.props.configurations.reduce((built, config) => {
      built.inprocess.push(config)
      return built
    }, {production: [], staging: [], inprocess: []})
    return (
      <div className="configuration-versions">
        <div className="sidebar-header">
          <h3>{this.props.propertyName}</h3>
          <p className="text-sm">{highestAttainment}</p>
        </div>
        <a className="sidebar-section-header">
          PRODUCTION
        </a>
        <ul className="version-list">
          {configs.production.length ?
            configs.production.map(versionFactory.bind(this)) :
            <li className="empty-msg">None in production</li>
          }
        </ul>
        <a className="sidebar-section-header">
          STAGING
        </a>
        <ul className="version-list">
          {configs.staging.length ?
            configs.staging.map(versionFactory.bind(this)) :
            <li className="empty-msg">None in staging</li>
          }
        </ul>
        <a className="sidebar-section-header">
          IN PROCESS
        </a>
        <ul className="version-list">
          {configs.inprocess.length ?
            configs.inprocess.map(versionFactory.bind(this)) :
            <li className="empty-msg">None in process</li>
          }
        </ul>
      </div>
    );
  }
}

ConfigurationVersions.displayName = 'ConfigurationVersions'
ConfigurationVersions.propTypes = {
  activate: React.PropTypes.func,
  activeIndex: React.PropTypes.number,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  propertyName: React.PropTypes.string
}

module.exports = ConfigurationVersions
