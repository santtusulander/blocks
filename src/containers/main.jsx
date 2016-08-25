import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as uiActionCreators from '../redux/modules/ui'
import * as purgeActionCreators from '../redux/modules/purge'
import * as userActionCreators from '../redux/modules/user'
import * as hostActionCreators from '../redux/modules/host'
import * as rolesActionCreators from '../redux/modules/roles'

import Header from '../components/header/header'
import Navigation from '../components/navigation/navigation.jsx'

import ErrorModal from '../components/error-modal'
import InfoModal from '../components/info-modal'
import PurgeModal from '../components/purge-modal'
import Notification from '../components/notification'
import LoadingSpinner from '../components/loading-spinner/loading-spinner'
import * as PERMISSIONS from '../constants/permissions.js'
import checkPermissions from '../util/permissions'

import {FormattedMessage} from 'react-intl'

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePurge: null
    }

    this.activatePurge = this.activatePurge.bind(this)
    this.saveActivePurge = this.saveActivePurge.bind(this)
    this.changePurge = this.changePurge.bind(this)
    this.logOut = this.logOut.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.hideNotification = this.hideNotification.bind(this)
    this.notificationTimeout = null
  }
  componentWillMount() {
    this.props.userActions.checkToken()
      .then(action => {
        if(action.error) {
          if(!this.pageAllowsAnon()) {
            this.props.router.push('/login')
          }
          return false
        }
        else {
          this.props.rolesActions.fetchRoles()
          const accountId = this.props.activeAccount.size ?
            this.props.activeAccount.get('id') :
            this.props.params.account

          return this.fetchAccountData(accountId, this.props.accounts)
        }
      })
  }

  //update account if account prop changed (in url) or clear active if there is no account in route
  componentWillReceiveProps(nextProps){
    !nextProps.params.account && nextProps.accountActions.clearActiveAccount()
    if (this.props.params.account !== nextProps.params.account) {
      this.fetchAccountData(nextProps.params.account, this.props.accounts)
    }
  }
  fetchAccountData(account, accounts) {
    if(accounts && accounts.isEmpty() && checkPermissions(
      this.props.roles,
      this.props.currentUser,
      PERMISSIONS.VIEW_CONTENT_ACCOUNTS
    )) {
      this.props.accountActions.fetchAccounts('udn')
    }
    if(account) {
      this.props.accountActions.fetchAccount('udn', account)
      this.props.groupActions.fetchGroups('udn', account)
    }
  }

  activatePurge(property) {
    return e => {
      if(e) {
        e.preventDefault()
      }
      this.setState({activePurge: property})
      this.props.purgeActions.resetActivePurge()
    }
  }
  changePurge(property) {
    this.setState({activePurge: property})
    this.props.purgeActions.resetActivePurge()
  }
  submitPurge(property) {
    let targetUrl = property.size ? property.get('services').get(0)
      .get('configurations').get(0).get('edge_configuration')
      .get('published_name') : ''
    if(property.size && property.get('services').get(0).get('deployment_mode') === 'trial') {
      targetUrl = property.get('services').get(0)
        .get('configurations').get(0).get('edge_configuration')
        .get('trial_name')
    }
    this.props.purgeActions.createPurge(
      'udn',
      this.props.activeAccount.get('id'),
      this.props.activeGroup.get('id'),
      targetUrl,
      this.props.activePurge.toJS()
    ).then((action) => {
      if(action.payload instanceof Error) {
        this.setState({activePurge: null})
        this.showNotification('Purge request failed: ' +
          action.payload.message)
      }
      else {
        this.setState({activePurge: null})
        this.showNotification(<FormattedMessage id="portal.purge.purgeSubmitted.text"/>)
      }
    })
  }
  saveActivePurge() {
    const purgeProperty = this.props.properties.find(property => property === this.state.activePurge)
    if(purgeProperty) {
      if(!this.props.activeHost || this.props.activeHost.get('services').get(0)
        .get('configurations').get(0).get('edge_configuration')
        .get('published_name') !== purgeProperty) {
        this.props.hostActions.fetchHost(
          'udn',
          this.props.activeAccount.get('id'),
          this.props.activeGroup.get('id'),
          purgeProperty
        ).then(action => {
          this.submitPurge(Immutable.fromJS(action.payload))
        })
      }
      else {
        this.submitPurge(this.props.activeHost)
      }
    }
  }
  logOut() {
    this.props.userActions.logOut()
    this.props.router.push('/login')
  }
  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
  }
  hideNotification() {
    this.props.uiActions.changeNotification()
  }
  pageAllowsAnon() {
    return this.props.location.pathname === '/login' ||
    this.props.location.pathname === '/forgot-password' ||
    this.props.location.pathname === '/set-password' ||
    this.props.location.pathname === '/starburst-help' ||
    this.props.location.pathname === '/styleguide'
  }
  render() {
    if((!this.props.currentUser.size || !this.props.roles.size) && !this.pageAllowsAnon()) {
      return <LoadingSpinner />
    }
    const infoDialogOptions = this.props.infoDialogOptions ? this.props.infoDialogOptions.toJS() : {}

    let classNames = 'main-container';
    let activeAccount = this.props.activeAccount
    /* If no activeAccount is set, but some accounts have been queried, use the
       first found. TODO: Is there a better way to pick default account?
     */
    if((!activeAccount || !activeAccount.size)
      && this.props.accounts && this.props.accounts.size) {
      activeAccount = this.props.accounts.first()
    }
    if(this.props.viewingChart) {
      classNames = `${classNames} chart-view`
    }
    const firstProperty = this.props.properties && this.props.properties.size ?
      this.props.properties.get(0)
      : null

    return (
      <div className={classNames}>
      {this.props.user.get('loggedIn') && !this.pageAllowsAnon() ?
        <Navigation
          activeAccount={activeAccount}
          activeGroup={this.props.activeGroup}
          activeHost={this.props.activeHost}
          currentUser={this.props.currentUser}
          params={this.props.params}
          pathname={this.props.location.pathname}
          roles={this.props.roles}
          />
        : ''
      }
        {this.props.user.get('loggedIn') && !this.pageAllowsAnon() ?
          <Header
            accounts={this.props.accounts}
            activeAccount={this.props.activeAccount}
            activeGroup={this.props.activeGroup}
            activeHost={this.props.activeHost}
            activatePurge={this.activatePurge(firstProperty)}
            breadcrumbs={this.props.breadcrumbs}
            fetching={this.props.fetching}
            fetchAccountData={this.fetchAccountData}
            theme={this.props.theme}
            handleThemeChange={this.props.uiActions.changeTheme}
            location={this.props.location}
            logOut={this.logOut}
            routes={this.props.routes}
            pathname={this.props.location.pathname}
            params={this.props.params}
            roles={this.props.roles}
            toggleAccountManagementModal={this.props.uiActions.toggleAccountManagementModal}
            user={this.props.currentUser}/>
          : ''
        }
        <div className="content-container">{this.props.children}</div>
        {this.state.activePurge !== null ?
          <PurgeModal
            activeProperty={this.state.activePurge}
            activePurge={this.props.activePurge}
            availableProperties={this.props.properties}
            changeProperty={this.changePurge}
            changePurge={this.props.purgeActions.updateActivePurge}
            hideAction={this.activatePurge(null)}
            savePurge={this.saveActivePurge}
            showNotification={this.showNotification}/>
          : ''
        }

        <ErrorModal
          showErrorDialog={this.props.showErrorDialog}
          uiActions={this.props.uiActions}/>
        <InfoModal
          showErrorDialog={this.props.showInfoDialog}
          uiActions={this.props.uiActions}
          {...infoDialogOptions}/>

        <ReactCSSTransitionGroup
          component="div"
          className="notification-transition"
          transitionName="notification-transition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={500}
          transitionAppear={true}
          transitionAppearTimeout={1000}>
          {this.props.notification ?
            <Notification handleClose={this.hideNotification}>
              {this.props.notification}
            </Notification>
            : ''
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Main.displayName = 'Main'
Main.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  breadcrumbs: React.PropTypes.instanceOf(Immutable.Map),
  children: React.PropTypes.node,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  infoDialogOptions: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  notification: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  rolesActions: React.PropTypes.object,
  router: React.PropTypes.object,
  routes: React.PropTypes.array,
  showErrorDialog: React.PropTypes.bool,
  showInfoDialog: React.PropTypes.bool,
  theme: React.PropTypes.string,
  uiActions: React.PropTypes.object,
  user: React.PropTypes.instanceOf(Immutable.Map),
  userActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

Main.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  currentUser: Immutable.Map(),
  properties: Immutable.List(),
  roles: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activePurge: state.purge.get('activePurge'),
    currentUser: state.user.get('currentUser'),
    fetching: state.account.get('fetching') ||
      state.content.get('fetching') ||
      state.group.get('fetching') ||
      state.host.get('fetching') ||
      state.topo.get('fetching') ||
      state.traffic.get('fetching') ||
      state.visitors.get('fetching'),
    notification: state.ui.get('notification'),
    properties: state.host.get('allHosts'),
    roles: state.roles.get('roles'),
    showErrorDialog: state.ui.get('showErrorDialog'),
    showInfoDialog: state.ui.get('showInfoDialog'),
    infoDialogOptions: state.ui.get('infoDialogOptions'),
    theme: state.ui.get('theme'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart'),
    breadcrumbs: state.ui.get('breadcrumbs')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    rolesActions: bindActionCreators(rolesActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));
