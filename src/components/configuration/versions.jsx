import React from 'react'
import Immutable from 'immutable'
import { Button, ButtonToolbar } from 'react-bootstrap'

import IconAdd from '../icons/icon-add.jsx'
import IconDelete from '../icons/icon-delete.jsx'
import { SidebarLinks } from '../sidebar-links'

export class ConfigurationVersions extends React.Component {

  render() {
    if(this.props.fetching && (!this.props.activeHost || !this.props.activeHost.size)
      || (!this.props.activeHost || !this.props.activeHost.size)) {
      return <div>Loading...</div>
    }
    const configs = this.props.configurations.reduce((built, config, i) => {
      config = config.set('active', i === this.props.activeIndex)
      if(config.get('configuration_status').get('deployment_status') == 3){
        built.production.push(config)
      }
      else if(config.get('configuration_status').get('deployment_status') == 2){
        built.staging.push(config)
      }
      else {
        built.inprocess.push(config)
      }
      return built
    }, {production: [], staging: [], inprocess: []})
    return (
      <div className="configuration-versions">
        <div className="sidebar-header">
          <Button bsStyle="success" className="btn-icon add-btn pull-right"
            onClick={this.props.addVersion}>
            <IconAdd width="30" height="30" />
          </Button>
          <h1>
            Versions
          </h1>
        </div>
        <div className="sidebar-section-header">
          Active Production
        </div>
          <SidebarLinks
            activate={this.props.activate}
            emptyMsg="None"
            items={configs.production}
            tag={'config'}/>
        <div className="sidebar-section-header">
          Active Staging
        </div>
        <SidebarLinks
            activate={this.props.activate}
            emptyMsg="None"
            items={configs.staging}
            tag={'config'}/>
        <div className="sidebar-section-header">
          Saved
        </div>
        <SidebarLinks
          activate={this.props.activate}
          emptyMsg="None"
          items={configs.inprocess}
          tag={'config'}/>
        <div className="sidebar-section-header">
          De-Activated
        </div>
        <SidebarLinks
          activate={this.props.activate}
          emptyMsg="None"
          items={[]}
          tag={'config'}/>
      </div>
    );
  }
}

ConfigurationVersions.displayName = 'ConfigurationVersions'
ConfigurationVersions.propTypes = {
  activate: React.PropTypes.func,
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeIndex: React.PropTypes.number,
  addVersion: React.PropTypes.func,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  propertyName: React.PropTypes.string,
  status: React.PropTypes.number
}

module.exports = ConfigurationVersions
