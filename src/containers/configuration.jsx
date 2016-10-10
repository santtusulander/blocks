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
import * as securityActionCreators from '../redux/modules/security'
import * as uiActionCreators from '../redux/modules/ui'

import { getContentUrl, getUrl } from '../util/routes'
import checkPermissions from '../util/permissions'
import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../constants/permissions'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import AccountSelector from '../components/global-account-selector/global-account-selector'
import IconTrash from '../components/icons/icon-trash.jsx'
import TruncatedTitle from '../components/truncated-title'
import DeleteModal from '../components/delete-modal'
import IsAllowed from '../components/is-allowed'

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

import { FormattedMessage } from 'react-intl'

const pubNamePath = ['services',0,'configurations',0,'edge_configuration','published_name']

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
    this.changeValues = this.changeValues.bind(this)
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
    this.props.securityActions.fetchSSLCertificates(brand, account, group)
  }
  componentWillReceiveProps(nextProps) {
    const currentHost = this.props.activeHost
    const nextHost = nextProps.activeHost
    if(!currentHost && nextHost ||
      currentHost.getIn(pubNamePath) !== nextHost.getIn(pubNamePath)) {
      this.setState({
        activeConfigOriginal: nextHost.getIn(['services',0,'configurations',this.state.activeConfig])
      })
    }
  }
  getActiveConfig() {
    return this.props.activeHost.getIn(['services',0,'configurations',this.state.activeConfig])
  }
  changeValue(path, value) {
    return this.changeValues([[path, value]])
  }

  isReadOnly() {
    return !checkPermissions(this.props.roles, this.props.currentUser, MODIFY_PROPERTY)
  }

  // allows changing multiple values while only changing state once
  // this is mostly useful for the enable SSL button in the security tab
  changeValues(values) {
    let activeConfig = this.getActiveConfig()

    for (const obj of values) {
      const path = obj[0]
      const value = obj[1]

      activeConfig = activeConfig.setIn(path, value)
    }

    return this.props.hostActions.changeActiveHost(
      this.props.activeHost.setIn(
        ['services', 0, 'configurations', this.state.activeConfig],
        activeConfig
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
        this.showNotification(<FormattedMessage id="portal.configuration.updateSuccessfull.text"/>)
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
          this.showNotification(<FormattedMessage id="portal.configuration.retireSuccessfull.text"/>)
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
          this.showNotification(<FormattedMessage id="portal.configuration.publishSuccessfull.text"/>)
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
    const readOnly = this.isReadOnly()
    return (
      <Content>
        {/*<AddConfiguration createConfiguration={this.createNewConfiguration}/>*/}
        <PageHeader
          pageSubTitle={<FormattedMessage id="portal.configuration.header.text"/>}
          pageHeaderDetails={[activeConfig.get('edge_configuration').get('origin_host_name'),
            deployMoment.format('MMM, D YYYY'),
            deployMoment.format('H:MMa'),
            activeConfig.get('configuration_status').get('last_edited_by')]}>
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
            <IsAllowed to={DELETE_PROPERTY}>
              <Button
                bsStyle="danger"
                className="btn btn-icon"
                onClick={() => this.setState({ deleteModal: true })}>
                <IconTrash/>
              </Button>
            </IsAllowed>
            {activeEnvironment === 2 ||
              activeEnvironment === 1 ||
              !activeEnvironment ?
              <IsAllowed to={MODIFY_PROPERTY}>
                <Button
                  bsStyle="primary"
                  onClick={this.togglePublishModal}>
                  <FormattedMessage id="portal.button.publish"/>
                </Button>
              </IsAllowed>
              : null
            }
            {/* Hide in 1.0 – UDNP-1406
            <Button bsStyle="primary" onClick={this.cloneActiveVersion}>
              <FormattedMessage id="portal.button.copy"/>
            </Button>
            {activeEnvironment === 2 || activeEnvironment === 3 ?
              <Button bsStyle="primary"
                onClick={() => this.changeActiveVersionEnvironment(1)}>
                <FormattedMessage id="portal.button.retire"/>
              </Button>
              : null
            }
            <Button bsStyle="primary" onClick={this.toggleVersionModal}>
              <FormattedMessage id="portal.button.versions"/>
            </Button>
            */}
          </ButtonToolbar>
        </PageHeader>

        <Nav bsStyle="tabs" activeKey={this.state.activeTab}
          onSelect={this.activateTab}>
          <NavItem eventKey={'details'}>
            <FormattedMessage id="portal.configuration.hostname.text"/>
          </NavItem>
          <NavItem eventKey={'defaults'}>
            <FormattedMessage id="portal.configuration.defaults.text"/>
          </NavItem>
          <NavItem eventKey={'policies'}>
            <FormattedMessage id="portal.configuration.policies.text"/>
          </NavItem>
          <NavItem eventKey={'security'}>
            <FormattedMessage id="portal.configuration.security.text"/>
          </NavItem>
          {/* Hide in 1.0 – UDNP-1406
          <NavItem eventKey={'performance'}>
            <FormattedMessage id="portal.configuration.performance.text"/>
          </NavItem>
          <NavItem eventKey={'security'}>
            <FormattedMessage id="portal.configuration.security.text"/>
          </NavItem>
          <NavItem eventKey={'certificates'}>
            <FormattedMessage id="portal.configuration.certificates.text"/>
          </NavItem>
          <NavItem eventKey={'change-log'}>
            <FormattedMessage id="portal.configuration.changeLog.text"/>
          </NavItem>
          */}
        </Nav>

        <PageContainer>
          {this.state.activeTab === 'details' ?
            <ConfigurationDetails
              readOnly={readOnly}
              edgeConfiguration={activeConfig.get('edge_configuration')}
              changeValue={this.changeValue}/>
            : null}

          {this.state.activeTab === 'defaults' ?
            <ConfigurationDefaults
              readOnly={readOnly}
              activateMatch={this.props.uiActions.changePolicyActiveMatch}
              activateRule={this.props.uiActions.changePolicyActiveRule}
              activateSet={this.props.uiActions.changePolicyActiveSet}
              activeMatch={this.props.policyActiveMatch}
              activeRule={this.props.policyActiveRule}
              activeSet={this.props.policyActiveSet}
              changeValue={this.changeValue}
              config={activeConfig}
              saveChanges={this.saveActiveHostChanges}/>
            : null}

          {this.state.activeTab === 'policies' ?
            <ConfigurationPolicies
              readOnly={readOnly}
              activateMatch={this.props.uiActions.changePolicyActiveMatch}
              activateRule={this.props.uiActions.changePolicyActiveRule}
              activateSet={this.props.uiActions.changePolicyActiveSet}
              activeMatch={this.props.policyActiveMatch}
              activeRule={this.props.policyActiveRule}
              activeSet={this.props.policyActiveSet}
              changeValue={this.changeValue}
              config={activeConfig}
              saveChanges={this.saveActiveHostChanges}/>
            : null}

            {this.state.activeTab === 'performance' ?
              <ConfigurationPerformance/>
              : null}

            {this.state.activeTab === 'security' ?
              <ConfigurationSecurity
                readOnly={readOnly}
                changeValue={this.changeValue}
                changeValues={this.changeValues}
                config={activeConfig}
                sslCertificates={this.props.sslCertificates} />
              : null}

            {this.state.activeTab === 'certificates' ?
              <ConfigurationCertificates/>
              : null}

            {this.state.activeTab === 'change-log' ?
              <ConfigurationChangeLog/>
              : null}
          </PageContainer>

          <ConfigurationDiffBar
            changeValue={this.changeValue}
            currentConfig={!this.props.notification ?
              activeConfig : Immutable.Map()}
            originalConfig={!this.props.notification ?
              this.state.activeConfigOriginal : Immutable.Map()}
            saveConfig={this.saveActiveHostChanges}
            saving={this.props.fetching}
            />

          {this.state.deleteModal && <DeleteModal
          itemToDelete="Property"
          cancel={toggleDelete}
          submit={() => {
            deleteHost(brand, account, group, property, this.props.activeHostConfiguredName)
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
      </Content>
    );
  }
}

Configuration.displayName = 'Configuration'
Configuration.propTypes = {
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  history: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  notification: React.PropTypes.string,
  params: React.PropTypes.object,
  policyActiveMatch: React.PropTypes.instanceOf(Immutable.List),
  policyActiveRule: React.PropTypes.instanceOf(Immutable.List),
  policyActiveSet: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object,
  securityActions: React.PropTypes.object,
  sslCertificates: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object
}
Configuration.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  sslCertificates: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activeHost: state.host.get('activeHost'),
    currentUser: state.user.get('currentUser'),
    fetching: state.host.get('fetching'),
    notification: state.ui.get('notification'),
    policyActiveMatch: state.ui.get('policyActiveMatch'),
    policyActiveRule: state.ui.get('policyActiveRule'),
    policyActiveSet: state.ui.get('policyActiveSet'),
    roles: state.roles.get('roles'),
    sslCertificates: state.security.get('sslCertificates')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    securityActions: bindActionCreators(securityActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Configuration));
