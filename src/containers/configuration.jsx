import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar, Nav, NavItem } from 'react-bootstrap'

import * as hostActionCreators from '../redux/modules/host'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import Dialog from '../components/layout/dialog'

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
    this.cloneActiveVersion = this.cloneActiveVersion.bind(this)
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
  activateVersion(id) {
    const index = this.props.activeHost.get('services').get(0)
      .get('configurations').findIndex(config => config.get('config_id') === id)
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
  cloneActiveVersion() {
    let newVersion = this.getActiveConfig()
    newVersion = newVersion
      .set('label', `Copy of ${newVersion.get('label') || newVersion.get('config_id')}`)
      .set('config_id', this.props.activeHost.getIn(['services',0,'configurations']).size)
      .setIn(['configuration_status','environment'], 'in_process')
    const newHost = this.props.activeHost.setIn(['services',0,'configurations'],
      this.props.activeHost.getIn(['services',0,'configurations']).push(newVersion))
    this.props.hostActions.updateHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      newHost.toJS()
    )
  }
  render() {
    if(this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <div className="container">Loading...</div>
    }
    const activeConfig = this.getActiveConfig()

    return (
      <PageContainer hasSidebar={true} className="configuration-container">
        <Sidebar>
          <ConfigurationVersions
            fetching={this.props.fetching}
            configurations={this.props.activeHost.get('services').get(0).get('configurations')}
            activate={this.activateVersion}
            propertyName={this.props.params.host}
            activeIndex={this.state.activeConfig}
            addVersion={this.cloneActiveVersion}/>
        </Sidebar>
        <Content>
          {/*<AddConfiguration createConfiguration={this.createNewConfiguration}/>*/}

          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary">Publish</Button>
              <Button bsStyle="primary">Copy</Button>
              <Button bsStyle="primary">Retire</Button>
            </ButtonToolbar>

            <h1>{activeConfig.get('label') || activeConfig.get('config_id')}</h1>
            <p className="text-sm">
              <span className="right-separator">
                {activeConfig.get('edge_configuration').get('origin_host_name')}
              </span>
              <span className="right-separator">
                {activeConfig.get('configuration_status').get('last_edited').split(' - ')[0]}
              </span>
              <span className="right-separator">
                {activeConfig.get('configuration_status').get('last_edited').split(' - ')[1]} am
              </span>
              {activeConfig.get('configuration_status').get('last_edited_by')}
            </p>
          </PageHeader>

          <Nav bsStyle="tabs" activeKey={this.state.activeTab}
            onSelect={this.activateTab}>
            <NavItem eventKey={'details'}>
              Hostname
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

          <div className="container-fluid content-container">
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

          <Dialog>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary">CANCEL</Button>
              <Button className="btn btn-save">SAVE</Button>
            </ButtonToolbar>
            <div>
            <p className="configuration-dialog-title">5 Changes</p>
            <p>[versionname], [versionname], [versionname], [versionname], [versionname]</p></div>
          </Dialog>

        </Content>
      </PageContainer>
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
