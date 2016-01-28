import React from 'react'
import Immutable from 'immutable'

export class ConfigurationVersions extends React.Component {
  constructor(props) {
    super(props);

    this.activate = this.activate.bind(this)
    this.delete = this.delete.bind(this)
  }
  activate(index) {
    return e => {
      e.stopPropagation()
      this.props.activate(index)
    }
  }
  delete(id) {
    return e => {
      e.stopPropagation()
      this.props.delete(id)
    }
  }
  render() {
    if(this.props.fetching) {
      return <div>Loading...</div>
    }
    return (
      <div className="configuration-versions">
        <div className="sidebar-header">
          <h3>{this.props.propertyName} www.lorem.com</h3>
          <p className="text-sm">In Production</p>
        </div>
        <a className="sidebar-section-header">
          PRODUCTION
        </a>
        <ul className="version-list">
          <li>
            <a href="#" className="version-link active">
              <div className="version-title">Prod_version title</div>
            </a>
          </li>
        </ul>
        <a className="sidebar-section-header">
          STAGING
        </a>
        <ul className="version-list">
          <li>
            <a href="#" className="version-link">
              <div className="version-title">Staging_version title</div>
            </a>
          </li>
        </ul>
        <a className="sidebar-section-header">
          IN PROCESS
        </a>
        <ul className="version-list">
          <li>
            <a href="#" className="version-link">
              <div className="version-title">Staging_version title</div>
            </a>
          </li>
          <li>
            <a href="#" className="version-link">
              <div className="version-title">Staging_version title</div>
            </a>
          </li>
        </ul>
        {this.props.configurations.map((configuration, i) => {
          return (
            <div key={i}>
              {configuration.get('config_id')}
              <a href="#" onClick={this.activate(i)}>edit</a>
              &nbsp;
              <a href="#" onClick={this.delete(configuration.get('config_id'))}>delete</a>
            </div>
          )
        })}
      </div>
    );
  }
}

ConfigurationVersions.displayName = 'ConfigurationVersions'
ConfigurationVersions.propTypes = {
  activate: React.PropTypes.func,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  delete: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  propertyName: React.PropTypes.string
}

module.exports = ConfigurationVersions
