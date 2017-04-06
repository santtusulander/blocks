import React from 'react'
import Immutable from 'immutable'
import { Button } from 'react-bootstrap'

import IconAdd from '../shared/icons/icon-add.jsx'
import { SidebarLinks } from '../shared/sidebar-link/sidebar-links'

import {FormattedMessage, injectIntl} from 'react-intl'

export class ConfigurationVersions extends React.Component {

  render() {
    if (this.props.fetching && (!this.props.activeHost || !this.props.activeHost.size)
      || (!this.props.activeHost || !this.props.activeHost.size)) {
      return <div><FormattedMessage id="portal.loading.text"/></div>
    }
    const configs = this.props.configurations.reduce((built, config, i) => {
      config = config.set('active', i === this.props.activeIndex)

      // eslint-disable-next-line eqeqeq
      if (config.get('configuration_status').get('deployment_status') == 3) {
        built.production.push(config)
        // eslint-disable-next-line eqeqeq
      } else if (config.get('configuration_status').get('deployment_status') == 2) {
        built.staging.push(config)
      } else {
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
            <FormattedMessage id="portal.policy.edit.versions.text"/>
          </h1>
        </div>
        <div className="sidebar-section-header">
          <FormattedMessage id="portal.policy.edit.versions.activeProduction.text"/>
        </div>
          <SidebarLinks
            activate={this.props.activate}
            emptyMsg={this.props.intl.formatMessage({id: 'portal.policy.edit.versions.none.text'})}
            items={configs.production}
            tag={'config'}/>
        <div className="sidebar-section-header">
          <FormattedMessage id="portal.policy.edit.versions.activeStaging.text"/>
        </div>
        <SidebarLinks
            activate={this.props.activate}
            emptyMsg={this.props.intl.formatMessage({id: 'portal.policy.edit.versions.none.text'})}
            items={configs.staging}
            tag={'config'}/>
        <div className="sidebar-section-header">
          <FormattedMessage id="portal.policy.edit.versions.saved.text"/>
        </div>
        <SidebarLinks
          activate={this.props.activate}
          emptyMsg={this.props.intl.formatMessage({id: 'portal.policy.edit.versions.none.text'})}
          items={configs.inprocess}
          tag={'config'}/>
        <div className="sidebar-section-header">
          <FormattedMessage id="portal.policy.edit.versions.deactivated.text"/>
        </div>
        <SidebarLinks
          activate={this.props.activate}
          emptyMsg={this.props.intl.formatMessage({id: 'portal.policy.edit.versions.none.text'})}
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
  intl: React.PropTypes.object
  // propertyName: React.PropTypes.string,
  // status: React.PropTypes.number
}

module.exports = injectIntl(ConfigurationVersions)
