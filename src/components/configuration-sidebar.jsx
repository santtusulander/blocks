import React from 'react';

const body = document.body
const bodyClass = body.className
const container = document.getElementById('configuration-sidebar-container')

class ConfigurationSidebar extends React.Component {
  componentDidMount() {
    this.copyLayer()
  }
  componentDidUpdate() {
    this.copyLayer()
    if(!this.props.hidden) {
      body.className = bodyClass + ' show-configuration-sidebar'
    } else {
      body.className = bodyClass
    }
  }
  componentWillUnmount() {
    container.innerHTML = ''
  }
  copyLayer() {
    container.innerHTML = ''
    container.appendChild(this.refs.configurationSidebar.cloneNode(true))
  }
  render() {
    return (
      <div className="hidden">
        <div className='configuration-sidebar' ref='configurationSidebar'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

ConfigurationSidebar.displayName = 'ConfigurationSidebar'
ConfigurationSidebar.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  hidden: React.PropTypes.bool
};

module.exports = ConfigurationSidebar;
