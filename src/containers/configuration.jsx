import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar, Nav, NavItem, Modal } from 'react-bootstrap'
import moment from 'moment'

import * as hostActionCreators from '../redux/modules/host'
import * as uiActionCreators from '../redux/modules/ui'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'

import ConfigurationDetails from '../components/configuration/details'
import ConfigurationDefaults from '../components/configuration/defaults'
import ConfigurationPolicies from '../components/configuration/policies'
import ConfigurationPerformance from '../components/configuration/performance'
import ConfigurationSecurity from '../components/configuration/security'
import ConfigurationCertificates from '../components/configuration/certificates'
import ConfigurationChangeLog from '../components/configuration/change-log'
import ConfigurationVersions from '../components/configuration/versions'
import ConfigurationPublishVersion from '../components/configuration/publish-version'
import ConfigurationDiffBar from '../components/configuration/diff-bar'

export class Configuration extends React.Component {
  constructor(props) {
    super(props);

    const config = props.activeHost ? props.activeHost.getIn(['services',0,'configurations',0]) : null

    this.state = {
      activeTab: 'details',
      activeConfig: 0,
      activeConfigOriginal: config,
      showPublishModal: false
    }

    this.changeValue = this.changeValue.bind(this)
    this.saveActiveHostChanges = this.saveActiveHostChanges.bind(this)
    this.activateTab = this.activateTab.bind(this)
    this.activateVersion = this.activateVersion.bind(this)
    this.cloneActiveVersion = this.cloneActiveVersion.bind(this)
    this.changeActiveVersionEnvironment = this.changeActiveVersionEnvironment.bind(this)
    this.togglePublishModal = this.togglePublishModal.bind(this)
    this.showNotification = this.showNotification.bind(this)
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.location.query.name
    )
  }
  componentWillReceiveProps(nextProps) {
    if(!this.props.activeHost && nextProps.activeHost) {
      this.setState({
        activeConfigOriginal: nextProps.activeHost.getIn(['services',0,'configurations',this.state.activeConfig])
      })
    }
  }
  getActiveConfig() {
    return this.props.activeHost.getIn(['services',0,'configurations',this.state.activeConfig])
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
    this.props.hostActions.startFetching()
    this.props.hostActions.updateHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.location.query.name,
      this.props.activeHost.toJS()
    ).then((action) => {
      this.setState({
        activeConfigOriginal: Immutable.fromJS(action.payload).getIn(['services',0,'configurations',this.state.activeConfig])
      })
      this.showNotification('Configurations succesfully saved')
    })
  }
  activateTab(tabName) {
    this.setState({activeTab: tabName})
  }
  activateVersion(id) {
    const index = this.props.activeHost.get('services').get(0)
      .get('configurations').findIndex(config => config.get('config_id') === id)
    this.setState({
      activeConfig: index,
      activeConfigOriginal: this.props.activeHost.getIn(['services',0,'configurations',index])
    })
  }
  createNewVersion(id) {
    this.props.hostActions.createConfiguration(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.location.query.name,
      id
    )
  }
  cloneActiveVersion() {
    let newVersion = this.getActiveConfig()
    newVersion = newVersion
      .set('config_name', `Copy of ${newVersion.get('config_name') || newVersion.get('config_id')}`)
      .delete('config_id')
      .setIn(['configuration_status','environment'], 1)
    const newHost = this.props.activeHost.setIn(['services',0,'configurations'],
      this.props.activeHost.getIn(['services',0,'configurations']).push(newVersion))
    this.props.hostActions.updateHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.location.query.name,
      newHost.toJS()
    )
  }
  changeActiveVersionEnvironment(env) {
    let newHost = this.props.activeHost.setIn(
      ['services',0,'configurations',this.state.activeConfig],
      this.getActiveConfig().setIn(['configuration_status','environment'], env))
    this.props.hostActions.updateHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.location.query.name,
      newHost.toJS()
    )
  }
  togglePublishModal() {
    this.setState({showPublishModal: !this.state.showPublishModal})
  }
  showNotification(message) {
    this.props.uiActions.changeNotification(message)
    setTimeout(this.props.uiActions.changeNotification, 10000)
  }
  render() {
    if(this.props.fetching && (!this.props.activeHost || !this.props.activeHost.size)
      || (!this.props.activeHost || !this.props.activeHost.size)) {
      return <div className="container">Loading...</div>
    }
    const activeConfig = this.getActiveConfig()
    const activeEnvironment = activeConfig.get('configuration_status').get('environment')
    const deployMoment = moment(activeConfig.get('configuration_status').get('deployment_date'), 'X')

    return (
      <PageContainer hasSidebar={true} className="configuration-container">
        <Sidebar>
          <ConfigurationVersions
            fetching={this.props.fetching}
            configurations={this.props.activeHost.get('services').get(0).get('configurations')}
            activate={this.activateVersion}
            propertyName={this.props.location.query.name}
            activeIndex={this.state.activeConfig}
            addVersion={this.cloneActiveVersion}
            status={this.props.activeHost.get('status')}
            activeHost={this.props.activeHost}/>
        </Sidebar>
        <Content>
          {/*<AddConfiguration createConfiguration={this.createNewConfiguration}/>*/}

          <PageHeader>
            <ButtonToolbar className="pull-right">
              {activeEnvironment === 2 ||
                activeEnvironment === 1 ||
                !activeEnvironment ?
                <Button bsStyle="primary" onClick={this.togglePublishModal}>
                  Publish
                </Button>
                : ''
              }
              <Button bsStyle="primary" onClick={this.cloneActiveVersion}>
                Copy
              </Button>
              {activeEnvironment === 2 || activeEnvironment === 3 ?
                <Button bsStyle="primary"
                  onClick={() => this.changeActiveVersionEnvironment(1)}>
                  Retire
                </Button>
                : ''
              }
            </ButtonToolbar>

            <h1>{activeConfig.get('config_name') || activeConfig.get('config_id')}</h1>
            <p className="text-sm">
              <span className="right-separator">
                {activeConfig.get('edge_configuration').get('origin_host_name')}
              </span>
              <span className="right-separator">
                {deployMoment.format('MMM, D YYYY')}
              </span>
              <span className="right-separator">
                {deployMoment.format('H:MMa')}
              </span>
              {activeConfig.get('configuration_status').get('last_edited_by')}
            </p>
          </PageHeader>

          <Nav bsStyle="tabs" activeKey={this.state.activeTab}
            onSelect={this.activateTab}>
            <NavItem eventKey={'details'}>
              Hostname
            </NavItem>
            <NavItem eventKey={'defaults'}>
              Defaults
            </NavItem>
            <NavItem eventKey={'policies'}>
              Policies
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
                changeValue={this.changeValue}/>
              : null}

            {this.state.activeTab === 'defaults' ?
              <ConfigurationDefaults
                config={activeConfig}
                changeValue={this.changeValue}
                saveChanges={this.saveActiveHostChanges}/>
              : null}

            {this.state.activeTab === 'policies' ?
              <ConfigurationPolicies
                config={activeConfig}
                changeValue={this.changeValue}
                saveChanges={this.saveActiveHostChanges}
                location={this.props.location}/>
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

          <ConfigurationDiffBar
            changeValue={this.changeValue}
            currentConfig={activeConfig}
            originalConfig={this.state.activeConfigOriginal}
            saveConfig={this.saveActiveHostChanges}
            saving={this.props.fetching}
            />

        </Content>

        {this.state.showPublishModal ?
          <Modal show={true}
            dialogClassName="configuration-sidebar"
            onHide={this.togglePublishModal}>
            <Modal.Header>
              <h1>Publish Version</h1>
              <p>{this.props.location.query.name}</p>
            </Modal.Header>
            <Modal.Body>
              <ConfigurationPublishVersion
                hideAction={this.togglePublishModal}
                saveChanges={this.changeActiveVersionEnvironment}
                versionName={activeConfig.get('config_name') || activeConfig.get('config_id')}/>
            </Modal.Body>
          </Modal>
          : ''}
      </PageContainer>
    );
  }
}

Configuration.displayName = 'Configuration'
Configuration.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  uiActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    fetching: state.host.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
