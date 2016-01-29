import React from 'react'

class ConfigurationVersion extends React.Component {
  constructor(props) {
    super(props);

    this.activate = this.activate.bind(this)
  }
  activate(e) {
    e.stopPropagation()
    this.props.activate()
  }
  render() {
    return (
      <li>
        <a href="#"
          className={this.props.active ? 'active version-link' : 'version-link'}
          onClick={this.props.activate}>
          <div className="version-title">
            {this.props.label}
          </div>
        </a>
      </li>
    )
  }
}

ConfigurationVersion.displayName = 'ConfigurationVersion'
ConfigurationVersion.propTypes = {
  activate: React.PropTypes.func,
  active: React.PropTypes.bool,
  label: React.PropTypes.string
}

module.exports = ConfigurationVersion
