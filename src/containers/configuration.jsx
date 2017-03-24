import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { withRouter, Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as securityActionCreators from '../redux/modules/security'
import * as uiActionCreators from '../redux/modules/ui'

import propertyActions from '../redux/modules/entities/properties/actions'
import storageActions from '../redux/modules/entities/CIS-ingest-points/actions'
import { getByGroup } from '../redux/modules/entities/CIS-ingest-points/selectors'

import { getContentUrl } from '../util/routes'
import checkPermissions, { getStoragePermissions } from '../util/permissions'
import { hasService } from '../util/helpers'

import { MODIFY_PROPERTY, DELETE_PROPERTY } from '../constants/permissions'

import { MEDIA_DELIVERY_SECURITY } from '../constants/service-permissions'
import { deploymentModes, serviceTypes } from '../constants/configuration'
import { STORAGE_SERVICE_ID } from '../constants/service-permissions'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import AccountSelector from '../components/global-account-selector/global-account-selector'
import IconTrash from '../components/icons/icon-trash.jsx'
import TruncatedTitle from '../components/truncated-title'
import IsAllowed from '../components/is-allowed'
import ModalWindow from '../components/modal'
import Tabs from '../components/tabs'
import IsAdmin from '../components/is-admin'

import ConfigurationVersions from '../components/configuration/versions'
import ConfigurationPublishVersion from '../components/configuration/publish-version'
import ConfigurationDiffBar from '../components/configuration/diff-bar'
import IconCaretDown from '../components/icons/icon-caret-down'
import LoadingSpinner from '../components/loading-spinner/loading-spinner'

const pubNamePath = ['services',0,'configurations',0,'edge_configuration','published_name']

export class Configuration extends React.Component {
  constructor(props) {
    super(props);

    const config = props.activeHost ? props.activeHost.getIn(['services',0,'configurations',0]) : null

    this.state = {
      deleteModal: false,
      activeConfig: 0,
      activeConfigOriginal: config,
      showPublishModal: false,
      showVersionModal: false
    }
    this.cancelEditPolicyRoute = this.cancelEditPolicyRoute.bind(this)
    this.changeValue = this.changeValue.bind(this)
    this.changeValues = this.changeValues.bind(this)
    this.saveActiveHostChanges = this.saveActiveHostChanges.bind(this)
    this.activateVersion = this.activateVersion.bind(this)
    this.cloneActiveVersion = this.cloneActiveVersion.bind(this)
    this.changeActiveVersionEnvironment = this.changeActiveVersionEnvironment.bind(this)
    this.togglePublishModal = this.togglePublishModal.bind(this)
    this.toggleVersionModal = this.toggleVersionModal.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.hasSecurityServicePermission = this.hasSecurityServicePermission.bind(this)
    this.notificationTimeout = null
  }
  componentWillMount() {
    const {brand, account, group, property} = this.props.params
    this.props.accountActions.fetchAccount(brand, account)
    this.props.groupActions.fetchGroup(brand, account, group)
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(brand, account, group, property)
    this.props.securityActions.fetchSSLCertificates(brand, account, group)
    this.props.fetchStorage(brand, account, group, 'full')
  }
  componentWillReceiveProps(nextProps) {
    const currentHost = this.props.activeHost
    const nextHost = nextProps.activeHost || Immutable.Map()
    if (
      (!currentHost && nextHost)
        || (currentHost.getIn(pubNamePath) !== nextHost.getIn(pubNamePath))
        || (this.props.fetching && !nextProps.fetching)
    ) {
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

  hasSecurityServicePermission() {
    return this.props.servicePermissions.contains(MEDIA_DELIVERY_SECURITY)
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

    this.props.hostActions.changeActiveHost(
      this.props.activeHost.setIn(
        ['services', 0, 'configurations', this.state.activeConfig],
        activeConfig
      )
    )
  }
  /**
   * If URL has parameters for editing/deleting a policy, this function can be called to
   * strip away those parameters.
   */
  cancelEditPolicyRoute() {
    const { params, router } = this.props
    if (params.editOrDelete) {
      const url = getContentUrl('propertyConfiguration', params.property, params)
      router.push(`${url}/policies`)
    }
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
        this.showNotification(this.props.intl.formatMessage(
                              {id: 'portal.configuration.updateFailed.text'},
                              {reason: action.payload.data.message}))
      } else {
        this.setState({
          activeConfigOriginal: Immutable.fromJS(action.payload).getIn(['services',0,'configurations',this.state.activeConfig])
        })
        this.showNotification(<FormattedMessage id="portal.configuration.updateSuccessfull.text"/>)
      }
    })
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

    this.props.hostActions.startFetching()
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
          this.showNotification(this.props.intl.formatMessage(
                                {id: 'portal.configuration.retireFailed.text'},
                                {reason: action.payload.data.message}))
        } else {
          this.showNotification(<FormattedMessage id="portal.configuration.retireSuccessfull.text"/>)
        }
      // env !== 1 is publishing
      } else {
        if(action.error) {
          this.togglePublishModal()
          this.showNotification(this.props.intl.formatMessage(
                                {id: 'portal.configuration.publishFailed.text'},
                                {reason: action.payload.data.message}))
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
    const { intl: { formatMessage }, activeHost, deleteProperty , params: { brand, account, group, property }, router, children } = this.props
    if(this.props.fetching && (!activeHost || !activeHost.size)
      || (!activeHost || !activeHost.size)) {
      return <LoadingSpinner/>
    }
    const toggleDelete = () => this.setState({ deleteModal: !this.state.deleteModal })
    const activeConfig = this.getActiveConfig()
    const updateMoment = moment(activeConfig.get('config_updated'), 'X')
    const activeEnvironment = activeConfig.get('configuration_status').get('deployment_status')
    const deployMoment = moment(activeConfig.get('configuration_status').get('deployment_date'), 'X')
    const deploymentMode = activeHost.getIn(['services', 0, 'deployment_mode'])
    const serviceType = activeHost.getIn(['services', 0, 'service_type'])
    const deploymentModeText = formatMessage({ id: deploymentModes[deploymentMode] || deploymentModes['unknown'] })
    const serviceTypeText = formatMessage({ id: serviceTypes[serviceType] || serviceTypes['unknown'] })
    const readOnly = this.isReadOnly()
    const baseUrl = getContentUrl('propertyConfiguration', property, { brand, account, group })
    return (
      <Content>
        {/*<AddConfiguration createConfiguration={this.createNewConfiguration}/>*/}
        <PageHeader
          pageSubTitle={<FormattedMessage id="portal.configuration.header.text"/>}
          pageHeaderDetailsUpdated={[
            updateMoment.format('MMM, D YYYY'),
            updateMoment.format('h:mm a')
          ]}
          pageHeaderDetailsDeployed={[
            deployMoment.format('MMM, D YYYY'),
            deployMoment.format('h:mm a'),
            activeConfig.get('configuration_status').get('last_edited_by')
          ]}>
          <AccountSelector
            as="configuration"
            params={this.props.params}
            topBarTexts={{}}
            onSelect={(tier, value, params) => {
              const { params: { brand, account, group }, hostActions } = this.props
              hostActions.startFetching()
              hostActions.fetchHost(brand, account, group, value).then(() => {
                const url = getContentUrl('propertyConfiguration', value, params)
                this.props.router.push(`${url}/${children.props.route.path}`)
              })
            }}
            drillable={true}>
            <div className="btn btn-link dropdown-toggle header-toggle">
              <h1><TruncatedTitle content={property} tooltipPlacement="bottom" className="account-management-title"/></h1>
              <IconCaretDown />
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
        <Tabs activeKey={children.props.route.path}>
          <li data-eventKey='details'>
            <Link to={baseUrl + '/details'} activeClassName="active">
            <FormattedMessage id="portal.configuration.hostname.text"/>
            </Link>
          </li>
          <li data-eventKey='defaults'>
            <Link to={baseUrl + '/defaults'} activeClassName="active">
            <FormattedMessage id="portal.configuration.defaults.text"/>
            </Link>
          </li>
          <li data-eventKey='policies'>
            <Link to={baseUrl + '/policies'} activeClassName="active">
            <FormattedMessage id="portal.configuration.policies.text"/>
            </Link>
          </li>
          {this.hasSecurityServicePermission() &&
            <li data-eventKey='security'>
              <Link to={baseUrl + '/security'} activeClassName="active">
              <FormattedMessage id="portal.configuration.security.text"/>
              </Link>
            </li>
          }

          <li data-eventKey='gtm'>
            <Link to={baseUrl + '/gtm'} activeClassName="active">
            <FormattedMessage id="portal.configuration.gtm.text" />
            </Link>
          </li>

          <IsAdmin>
            <li data-eventKey='advanced'>
              <Link to={baseUrl + '/advanced'} activeClassName="active">
              <FormattedMessage id="portal.configuration.advanced.text" />
              </Link>
            </li>
          </IsAdmin>

          {/* Hide in 1.0 – UDNP-1406
          <li data-eventKey={'performance'}>
            <FormattedMessage id="portal.configuration.performance.text"/>
          </li>
          <li data-eventKey={'security'}>
            <FormattedMessage id="portal.configuration.security.text"/>
          </li>
          <li data-eventKey={'certificates'}>
            <FormattedMessage id="portal.configuration.certificates.text"/>
          </li>
          <li data-eventKey={'change-log'}>
            <FormattedMessage id="portal.configuration.changeLog.text"/>
          </li>
          */}
        </Tabs>

        <PageContainer>
          {React.cloneElement(children, {
            readOnly,
            params: this.props.params,
            cancelEditPolicyRoute: this.cancelEditPolicyRoute,
            activateMatch: this.props.uiActions.changePolicyActiveMatch,
            activateRule: this.props.uiActions.changePolicyActiveRule,
            activateSet: this.props.uiActions.changePolicyActiveSet,
            activeMatch: this.props.policyActiveMatch,
            activeRule: this.props.policyActiveRule,
            activeSet: this.props.policyActiveSet,
            changeValue: this.changeValue,
            changeValues: this.changeValues,
            config: activeConfig,
            deploymentMode: deploymentModeText,
            edgeConfiguration: activeConfig.get('edge_configuration'),
            groupHasStorageService: this.props.groupHasStorageService,
            saveChanges: this.saveActiveHostChanges,
            sslCertificates: this.props.sslCertificates,
            storages: this.props.storages,
            storagePermission: this.props.storagePermission,
            serviceType: serviceType,
            serviceTypeText: serviceTypeText
          })}
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

        {this.state.deleteModal &&
        <ModalWindow
          title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: "Property"}}/>}
          cancelButton={true}
          deleteButton={true}
          cancel={toggleDelete}
          onSubmit={() =>
            deleteProperty(brand, account, group, activeHost.get('published_host_id'))
              .then(action => {
                if (action.error) {
                  this.showNotification(this.props.intl.formatMessage(
                                        {id: 'portal.configuration.deleteFailed.text'},
                                        {reason: action.payload.data.message}))
                } else {
                  this.showNotification(<FormattedMessage id="portal.configuration.deleteSuccess.text"/>)
                  router.push(getContentUrl('group', group, { brand, account }))
                }
              })
            }
          invalid={true}
          verifyDelete={true}>
          <p>
            <FormattedMessage id="portal.deleteModal.warning.text" values={{itemToDelete : "Property"}}/>
          </p>
        </ModalWindow>
        }

        {this.state.showPublishModal &&
          <Modal show={true}
            dialogClassName="configuration-sidebar"
            onHide={this.togglePublishModal}>
            <Modal.Header>
              <h1><FormattedMessage id="portal.configuration.sidebar.pubVer.text" /></h1>
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
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  children: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  deleteProperty: React.PropTypes.func,
  fetchStorage: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  groupHasStorageService: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  intl: React.PropTypes.object,
  notification: React.PropTypes.string,
  params: React.PropTypes.object,
  policyActiveMatch: React.PropTypes.instanceOf(Immutable.List),
  policyActiveRule: React.PropTypes.instanceOf(Immutable.List),
  policyActiveSet: React.PropTypes.instanceOf(Immutable.List),
  roles: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object,
  securityActions: React.PropTypes.object,
  servicePermissions: React.PropTypes.instanceOf(Immutable.List),
  sslCertificates: React.PropTypes.instanceOf(Immutable.List),
  storagePermission: React.PropTypes.object,
  storages: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object
}
Configuration.defaultProps = {
  activeHost: Immutable.Map(),
  servicePermissions: Immutable.List(),
  sslCertificates: Immutable.List()
}

function mapStateToProps(state) {
  const { group, roles } = state
  const activeGroup = group.get('activeGroup') || Immutable.Map()
  const groupHasStorageService = hasService(activeGroup, STORAGE_SERVICE_ID)
  const storagePermission = getStoragePermissions(roles.get('roles'), state.user.get('currentUser'))

  return {
    activeHost: state.host.get('activeHost'),
    currentUser: state.user.get('currentUser'),
    storages: getByGroup(state, activeGroup.get('id')),
    fetching: state.host.get('fetching'),
    notification: state.ui.get('notification'),
    policyActiveMatch: state.ui.get('policyActiveMatch'),
    policyActiveRule: state.ui.get('policyActiveRule'),
    policyActiveSet: state.ui.get('policyActiveSet'),
    roles: state.roles.get('roles'),
    groupHasStorageService,
    storagePermission,
    servicePermissions: state.group.get('servicePermissions'),
    sslCertificates: state.security.get('sslCertificates')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    securityActions: bindActionCreators(securityActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    deleteProperty: (brand, account, group, id) => dispatch(propertyActions.remove({brand, account, group, id})),
    fetchStorage : (brand, account, group, format) => dispatch(storageActions.fetchAll({ brand, account, group, format }))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Configuration)));
