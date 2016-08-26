import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar, Nav, NavItem, Modal } from 'react-bootstrap'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as uiActionCreators from '../redux/modules/ui'

import { getContentUrl } from '../util/helpers'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import AccountSelector from '../components/global-account-selector/global-account-selector'
import IconTrash from '../components/icons/icon-trash.jsx'
import TruncatedTitle from '../components/truncated-title'
import DeleteModal from '../components/delete-modal'

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

import { getUrl } from '../util/helpers'

export class Configuration extends React.Component {
  constructor(props) {
    super(props);

    const config = props.activeHost ? props.activeHost.getIn(['services',0,'configurations',0]) : null

    this.state = {
      deleteModal: false,
      activeTab: 'details',
      activeConfig: 0,
      activeConfigOriginal: config,
      showPublishModal: false,
      showVersionModal: false
    }

    this.changeValue = this.changeValue.bind(this)
    this.saveActiveHostChanges = this.saveActiveHostChanges.bind(this)
    this.activateTab = this.activateTab.bind(this)
    this.activateVersion = this.activateVersion.bind(this)
    this.cloneActiveVersion = this.cloneActiveVersion.bind(this)
    this.changeActiveVersionEnvironment = this.changeActiveVersionEnvironment.bind(this)
    this.togglePublishModal = this.togglePublishModal.bind(this)
    this.toggleVersionModal = this.toggleVersionModal.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.notificationTimeout = null
  }
  componentWillMount() {
    const {brand, account, group, property} = this.props.params
    this.props.accountActions.fetchAccount(brand, account)
    this.props.groupActions.fetchGroup(brand, account, group)
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(brand, account, group, property)
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
    return this.props.hostActions.changeActiveHost(
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
      this.props.params.property,
      this.props.activeHost.toJS()
    ).then((action) => {
      if(action.error) {
        this.showNotification('Saving configurations failed: ' +
          action.payload.status + ' ' +
          action.payload.statusText)
      } else {
        this.setState({
          activeConfigOriginal: Immutable.fromJS(action.payload).getIn(['services',0,'configurations',this.state.activeConfig])
        })
        this.showNotification('Configurations succesfully saved')
      }
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
      activeConfigOriginal: this.props.activeHost.getIn(['services',0,'configurations',index]),
      showVersionModal: false
    })
  }
  createNewVersion(id) {
    this.props.hostActions.createConfiguration(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.property,
      id
    )
  }
  cloneActiveVersion() {
    let newVersion = this.getActiveConfig()
    newVersion = newVersion
      .set('config_name', `Copy of ${newVersion.get('config_name') || newVersion.get('config_id')}`)
      .delete('config_id')
      .setIn(['configuration_status','deployment_status'], 1)
    const newHost = this.props.activeHost.setIn(['services',0,'configurations'],
      this.props.activeHost.getIn(['services',0,'configurations']).push(newVersion))
    this.props.hostActions.updateHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.property,
      newHost.toJS()
    )
  }
  changeActiveVersionEnvironment(env) {
    let newHost = this.props.activeHost.setIn(
      ['services',0,'configurations',this.state.activeConfig],
      this.getActiveConfig().setIn(['configuration_status','deployment_status'], env))

    // Set the active_configurations when publishing
    newHost = this.props.activeHost.setIn(
      ['services', 0, 'active_configurations'],
      Immutable.fromJS([
        {config_id: this.getActiveConfig().get('config_id')}
      ])
    )

    this.props.hostActions.updateHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.params.property,
      newHost.toJS()
    ).then((action) => {
      // env === 1 is retiring
      if(env === 1) {
        if(action.error) {
          this.showNotification('Retiring configurations failed: ' +
            action.payload.status + ' ' +
            action.payload.statusText)
        } else {
          this.showNotification('Configurations succesfully retired')
        }
      // env !== 1 is publishing
      } else {
        if(action.error) {
          this.togglePublishModal()
          this.showNotification('Publishing configurations failed: ' +
            action.payload.status + ' ' +
            action.payload.statusText)
        } else {
          this.togglePublishModal()
          this.showNotification('Configurations succesfully published')
        }
      }
    })
  }
  togglePublishModal() {
    this.setState({showPublishModal: !this.state.showPublishModal})
  }
  toggleVersionModal() {
    this.setState({showVersionModal: !this.state.showVersionModal})
  }
  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
  }
  render() {
    if(this.props.fetching && (!this.props.activeHost || !this.props.activeHost.size)
      || (!this.props.activeHost || !this.props.activeHost.size)) {
      return <div className="container">Loading...</div>
    }
    const { hostActions: { deleteHost }, params: { brand, account, group, property }, router } = this.props
    const toggleDelete = () => this.setState({ deleteModal: !this.state.deleteModal })
    const activeConfig = this.getActiveConfig()
    const activeEnvironment = activeConfig.get('configuration_status').get('deployment_status')
    const deployMoment = moment(activeConfig.get('configuration_status').get('deployment_date'), 'X')

    return (
      <PageContainer className="configuration-container">
        <Content>
          {/*<AddConfiguration createConfiguration={this.createNewConfiguration}/>*/}
          <div className="configuration-header">
            <PageHeader>
              <h5>CONFIGURATION</h5>
              <div className="content-layout__header">
                <AccountSelector
                  as="configuration"
                  params={this.props.params}
                  topBarTexts={{}}
                  onSelect={(tier, value, params) => {
                    const { brand, account, group } = params, { hostActions } = this.props
                    hostActions.startFetching()
                    hostActions.fetchHost(brand, account, group, value).then(() => {
                      this.props.router.push(`${getUrl('/content', tier, value, params)}/configuration`)
                    })
                  }}
                  drillable={true}>
                  <div className="btn btn-link dropdown-toggle header-toggle">
                    <h1><TruncatedTitle content={this.props.params.property} tooltipPlacement="bottom" className="account-management-title"/></h1>
                    <span className="caret"></span>
                  </div>
                </AccountSelector>
                <ButtonToolbar className="pull-right">
                  <Button bsStyle="danger" className="btn btn-icon" onClick={() => this.setState({ deleteModal: true })}>
                    <IconTrash/>
                  </Button>
                  {activeEnvironment === 2 ||
                    activeEnvironment === 1 ||
                    !activeEnvironment ?
                    <Button bsStyle="primary" onClick={this.togglePublishModal}>
                      Publish
                    </Button>
                    : null
                  }
                  <Button bsStyle="primary" onClick={this.cloneActiveVersion}>
                    Copy
                  </Button>
                  {activeEnvironment === 2 || activeEnvironment === 3 ?
                    <Button bsStyle="primary"
                      onClick={() => this.changeActiveVersionEnvironment(1)}>
                      Retire
                    </Button>
                    : null
                  }
                  <Button bsStyle="primary" onClick={this.toggleVersionModal}>
                    Versions
                  </Button>
                </ButtonToolbar>
              </div>
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
          </div>
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
            currentConfig={!this.props.notification ?
              activeConfig : Immutable.Map()}
            originalConfig={!this.props.notification ?
              this.state.activeConfigOriginal : Immutable.Map()}
            saveConfig={this.saveActiveHostChanges}
            saving={this.props.fetching}
            />

        </Content>
        {this.state.deleteModal && <DeleteModal
          itemToDelete="Property"
          cancel={toggleDelete}
          submit={() => {
            deleteHost(brand, account, group, property)
              .then(() => router.push(getContentUrl('group', group, { brand, account })))
          }}/>
        }
        {this.state.showPublishModal &&
          <Modal show={true}
            dialogClassName="configuration-sidebar"
            onHide={this.togglePublishModal}>
            <Modal.Header>
              <h1>Publish Version</h1>
              <p>{this.props.params.property}</p>
            </Modal.Header>
            <Modal.Body>
              <ConfigurationPublishVersion
                hideAction={this.togglePublishModal}
                saveChanges={this.changeActiveVersionEnvironment}
                versionName={activeConfig.get('config_name') || activeConfig.get('config_id')}
                publishing={this.props.fetching}/>
            </Modal.Body>
          </Modal>}

          {this.state.showVersionModal &&
            <Modal show={true}
              dialogClassName="configuration-sidebar configuration-versions-sidebar"
              onHide={this.toggleVersionModal}>
              <Sidebar>
                <ConfigurationVersions
                  fetching={this.props.fetching}
                  configurations={this.props.activeHost.get('services').get(0).get('configurations')}
                  activate={this.activateVersion}
                  propertyName={this.props.params.property}
                  activeIndex={this.state.activeConfig}
                  addVersion={this.cloneActiveVersion}
                  status={this.props.activeHost.get('status')}
                  activeHost={this.props.activeHost}/>
              </Sidebar>
            </Modal>}
      </PageContainer>
    );
  }
}

Configuration.displayName = 'Configuration'
Configuration.propTypes = {
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  history: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  location: React.PropTypes.object,
  notification: React.PropTypes.string,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object
}
Configuration.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    fetching: state.host.get('fetching'),
    notification: state.ui.get('notification')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Configuration));
