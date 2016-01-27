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
        <h2>{this.props.propertyName}</h2>
        <p>In Production</p>
        <h3>Production</h3>
        <h3>Staging</h3>
        <h3>In Process</h3>
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
