import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { withRouter, Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { isDirty } from 'redux-form'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import classNames from 'classnames'

import * as accountActionCreators from '../redux/modules/account'
import * as hostActionCreators from '../redux/modules/host'
import * as securityActionCreators from '../redux/modules/security'
import * as uiActionCreators from '../redux/modules/ui'

import propertyActions from '../redux/modules/entities/properties/actions'
import storageActions from '../redux/modules/entities/CIS-ingest-points/actions'
import { getByGroup } from '../redux/modules/entities/CIS-ingest-points/selectors'
import { getById as getGroupById } from '../redux/modules/entities/groups/selectors'
import { getCurrentUser } from '../redux/modules/user'

import { parseResponseError } from '../redux/util'
import { getContentUrl } from '../util/routes'
import { checkUserPermissions, getStoragePermissions } from '../util/permissions'
import { hasService, formatMoment, hasOption } from '../util/helpers'

import { MODIFY_PROPERTY, DELETE_PROPERTY, VIEW_ADVANCED, MODIFY_ADVANCED } from '../constants/permissions'

import { deploymentModes, serviceTypes } from '../constants/configuration'
import { STORAGE_SERVICE_ID, GTM_SERVICE_ID, MEDIA_DELIVERY_SECURITY_OPTION_ID } from '../constants/service-permissions'

import PageContainer from '../components/shared/layout/page-container'
import Sidebar from '../components/shared/layout/section-header'
import Content from '../components/shared/layout/content'
import PageHeader from '../components/shared/layout/page-header'
import { PropertyConfigAccountSelector as AccountSelector } from '../components/global-account-selector/account-selector-container'
import IconTrash from '../components/shared/icons/icon-trash.jsx'
import TruncatedTitle from '../components/shared/page-elements/truncated-title'
import IsAllowed from '../components/shared/permission-wrappers/is-allowed'
import ModalWindow from '../components/shared/modal'
import Tabs from '../components/shared/page-elements/tabs'

import ConfigurationVersions from '../components/configuration/versions'
import ConfigurationPublishVersion from '../components/configuration/publish-version'
import ConfigurationDiffBar from '../components/configuration/diff-bar'
import IconCaretDown from '../components/shared/icons/icon-caret-down'
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
    this.notificationTimeout = null
  }
  componentWillMount() {
    const {brand, account, group, property} = this.props.params
    this.props.accountActions.fetchAccount(brand, account)
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
    return !checkUserPermissions(this.props.currentUser, MODIFY_PROPERTY)
  }

  isAdvancedTabReadOnly() {
    return !checkUserPermissions(this.props.currentUser, MODIFY_ADVANCED)
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
   * If URL has parameters for editing/deleting a policy, this function can be called
   * to strip away those parameters.
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
      if (action.error) {
        this.showNotification(this.props.intl.formatMessage(
                              {id: 'portal.configuration.updateFailed.text'},
                              {reason: parseResponseError(action.payload)}))
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
      if (env === 1) {
        if (action.error) {
          this.showNotification(this.props.intl.formatMessage(
                                {id: 'portal.configuration.retireFailed.text'},
                                {reason: parseResponseError(action.payload)}))
        } else {
          this.showNotification(<FormattedMessage id="portal.configuration.retireSuccessfull.text"/>)
        }
      // env !== 1 is publishing
      } else {
        if (action.error) {
          this.togglePublishModal()
          this.showNotification(this.props.intl.formatMessage(
                                {id: 'portal.configuration.publishFailed.text'},
                                {reason: parseResponseError(action.payload)}))
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
  showNotification(message = <FormattedMessage id="portal.configuration.updateSuccessfull.text"/>) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
  }
  render() {
    const {
      intl: { formatMessage },
      activeHost,
      deleteProperty ,
      params: { brand, account, group, property },
      router,
      children,
      isGTMFormDirty,
      groupHasGTMService,
      groupHasMDSecurity,
      isAdvancedFormDirty } = this.props

    if (this.props.fetching && (!activeHost || !activeHost.size)
      || (!activeHost || !activeHost.size)) {
      return <LoadingSpinner/>
    }
    const toggleDelete = () => this.setState({ deleteModal: !this.state.deleteModal })
    const activeConfig = this.getActiveConfig()
    const updateMoment = moment.unix(activeConfig.get('config_updated'))
    const activeEnvironment = activeConfig.get('configuration_status').get('deployment_status')
    const deployMoment = moment.unix(activeConfig.get('configuration_status').get('deployment_date'))
    const deploymentMode = activeHost.getIn(['services', 0, 'deployment_mode'])
    const serviceType = activeHost.getIn(['services', 0, 'service_type'])
    const deploymentModeText = formatMessage({ id: deploymentModes[deploymentMode] || deploymentModes['unknown'] })
    const serviceTypeText = formatMessage({ id: serviceTypes[serviceType] || serviceTypes['unknown'] })
    const readOnly = this.isReadOnly()
    const advancedTabReadOnly = this.isAdvancedTabReadOnly()
    const baseUrl = getContentUrl('propertyConfiguration', property, { brand, account, group })
    const diff = !Immutable.is(activeConfig, this.state.activeConfigOriginal)
    const customPolicyIsUsed = activeHost.getIn(['services', 0, 'uses_custom_policy_xml'])

    return (
      <Content>
        <PageHeader
          pageSubTitle={<FormattedMessage id="portal.configuration.header.text"/>}
          pageHeaderDetailsUpdated={[
            formatMoment(updateMoment, 'MMM, D YYYY'),
            formatMoment(updateMoment, 'h:mm a')
          ]}
          pageHeaderDetailsDeployed={[
            formatMoment(deployMoment, 'MMM, D YYYY'),
            formatMoment(deployMoment, 'h:mm a'),
            activeConfig.get('configuration_status').get('last_edited_by')
          ]}>
          <AccountSelector
            params={this.props.params}
            onItemClick={(entity) => {

              const { nodeInfo, idKey = 'id' } = entity
              const { params: { brand, account, group }, hostActions } = this.props
              hostActions.startFetching()
              hostActions.fetchHost(brand, account, group, entity[idKey]).then(() => {
                const url = getContentUrl('propertyConfiguration', entity[idKey], nodeInfo.parents)
                this.props.router.push(`${url}/${children.props.route.path}`)
              })

            }}>
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
          </ButtonToolbar>
        </PageHeader>
        <Tabs activeKey={children.props.route.path}>
          <li data-eventKey='details' className={classNames({ disabled: isAdvancedFormDirty || isGTMFormDirty })}>
            <Link to={baseUrl + '/details'} activeClassName="active">
            <FormattedMessage id="portal.configuration.hostname.text"/>
            </Link>
          </li>
          <li data-eventKey='defaults' className={classNames({ disabled: isAdvancedFormDirty || isGTMFormDirty })}>
            <Link to={baseUrl + '/defaults'} activeClassName="active">
            <FormattedMessage id="portal.configuration.defaults.text"/>
            </Link>
          </li>
          <li data-eventKey='policies' className={classNames({ disabled: isAdvancedFormDirty || isGTMFormDirty })}>
            <Link to={baseUrl + '/policies'} activeClassName="active">
            <FormattedMessage id="portal.configuration.policies.text"/>
            </Link>
          </li>
          {groupHasMDSecurity &&
            <li data-eventKey='security' className={classNames({ disabled: isAdvancedFormDirty || isGTMFormDirty })}>
              <Link to={baseUrl + '/security'} activeClassName="active">
              <FormattedMessage id="portal.configuration.security.text"/>
              </Link>
            </li>
          }
          { groupHasGTMService &&
            <li data-eventKey='gtm' className={classNames({ disabled: diff || isAdvancedFormDirty })}>
              <Link to={baseUrl + '/gtm'} activeClassName="active">
              <FormattedMessage id="portal.configuration.gtm.text" />
              </Link>
            </li>
          }

          <IsAllowed to={VIEW_ADVANCED}>
            <li data-eventKey='advanced' className={classNames({ disabled: diff || isGTMFormDirty })}>
              <Link to={baseUrl + '/advanced'} activeClassName="active">
              <FormattedMessage id="portal.configuration.advanced.text" />
              </Link>
            </li>
          </IsAllowed>
        </Tabs>

        <PageContainer>
          {React.cloneElement(children, {
            readOnly,
            advancedTabReadOnly,
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
            originalConfig: this.state.activeConfigOriginal || Immutable.Map(),
            saveChanges: this.saveActiveHostChanges,
            sslCertificates: this.props.sslCertificates,
            storages: this.props.storages,
            showNotification: this.showNotification,
            storagePermission: this.props.storagePermission,
            serviceType: serviceType,
            serviceTypeText: serviceTypeText,
            customPolicyIsUsed
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
                                        {reason: parseResponseError(action.payload)}))
                } else {
                  this.showNotification(<FormattedMessage id="portal.configuration.deleteSuccess.text"/>)
                  router.push(getContentUrl('group', group, { brand, account }))
                }
              })
            }
          invalid={true}
          verifyDelete={true}>
          <p>
            <FormattedMessage id="portal.deleteModal.warning.text" values={{itemToDelete: "Property"}}/>
          </p>
        </ModalWindow>
        }

        {this.state.showPublishModal &&
          <Modal show={true}
            dialogClassName="side-panel"
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
  groupHasGTMService: React.PropTypes.bool,
  groupHasMDSecurity: React.PropTypes.bool,
  groupHasStorageService: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  intl: React.PropTypes.object,
  isAdvancedFormDirty: React.PropTypes.bool,
  isGTMFormDirty: React.PropTypes.bool,
  notification: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.node]),
  params: React.PropTypes.object,
  policyActiveMatch: React.PropTypes.instanceOf(Immutable.List),
  policyActiveRule: React.PropTypes.instanceOf(Immutable.List),
  policyActiveSet: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object,
  securityActions: React.PropTypes.object,
  sslCertificates: React.PropTypes.instanceOf(Immutable.List),
  storagePermission: React.PropTypes.object,
  storages: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object
}
Configuration.defaultProps = {
  activeHost: Immutable.Map(),
  sslCertificates: Immutable.List()
}

function mapStateToProps(state, ownProps) {
  const activeGroup = getGroupById(state, ownProps.params.group) || Immutable.Map()
  const groupHasStorageService = hasService(activeGroup, STORAGE_SERVICE_ID)
  const groupHasGTMService = hasService(activeGroup, GTM_SERVICE_ID)
  const storagePermission = getStoragePermissions(getCurrentUser(state))
  const groupHasMDSecurity = hasOption(activeGroup, MEDIA_DELIVERY_SECURITY_OPTION_ID)

  const isGTMFormDirty = isDirty('gtmForm')
  const isAdvancedFormDirty = isDirty('advancedForm')

  return {
    activeHost: state.host.get('activeHost'),
    currentUser: getCurrentUser(state),
    storages: getByGroup(state, activeGroup.get('id')),
    fetching: state.host.get('fetching'),
    notification: state.ui.get('notification'),
    policyActiveMatch: state.ui.get('policyActiveMatch'),
    policyActiveRule: state.ui.get('policyActiveRule'),
    policyActiveSet: state.ui.get('policyActiveSet'),
    groupHasStorageService,
    groupHasGTMService,
    storagePermission,
    groupHasMDSecurity,
    sslCertificates: state.security.get('sslCertificates'),
    isGTMFormDirty: isGTMFormDirty(state),
    isAdvancedFormDirty: isAdvancedFormDirty(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    securityActions: bindActionCreators(securityActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    deleteProperty: (brand, account, group, id) => dispatch(propertyActions.remove({brand, account, group, id})),
    fetchStorage: (brand, account, group, format) => dispatch(storageActions.fetchAll({ brand, account, group, format }))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Configuration)));
