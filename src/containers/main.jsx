import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as uiActionCreators from '../redux/modules/ui'
import * as purgeActionCreators from '../redux/modules/purge'
import * as userActionCreators from '../redux/modules/user'
import * as hostActionCreators from '../redux/modules/host'

import Header from '../components/header'
import Navigation from '../components/navigation/navigation.jsx'

import ErrorModal from '../components/error-modal'
import InfoModal from '../components/info-modal'
import PurgeModal from '../components/purge-modal'
import Notification from '../components/notification'

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
    const accountId = this.props.activeAccount.size ?
      this.props.activeAccount.get('id') :
      this.props.params.account

    this.props.fetchAccountData(accountId, this.props.accounts)
  }

  //update account if account prop changed (in url) or clear active if there is no account in route
  componentWillReceiveProps(nextProps){
    !nextProps.params.account && nextProps.accountActions.clearActiveAccount()
    if (this.props.params.account !== nextProps.params.account) {
      this.props.fetchAccountData(nextProps.params.account, this.props.accounts)
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
        this.showNotification('Purge request succesfully submitted')
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
  render() {
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
      {this.props.user.get('loggedIn') &&
        this.props.location.pathname !== '/login' &&
        this.props.location.pathname !== '/starburst-help' ?
        <Navigation
          activeAccount={activeAccount}
          activeGroup={this.props.activeGroup}
          activeHost={this.props.activeHost}
          params={this.props.params}
          pathname={this.props.location.pathname}
          />
        : ''
      }
        {this.props.location.pathname !== '/login' &&
          this.props.location.pathname !== '/starburst-help' ?
          <Header
            accounts={this.props.accounts}
            activeAccount={this.props.activeAccount}
            activeGroup={this.props.activeGroup}
            activeHost={this.props.activeHost}
            activatePurge={this.activatePurge(firstProperty)}
            breadcrumbs={this.props.breadcrumbs}
            fetching={this.props.fetching}
            fetchAccountData={this.props.fetchAccountData}
            theme={this.props.theme}
            handleThemeChange={this.props.uiActions.changeTheme}
            location={this.props.location}
            logOut={this.logOut}
            routes={this.props.routes}
            pathname={this.props.location.pathname}
            params={this.props.params}
            toggleAccountManagementModal={this.props.uiActions.toggleAccountManagementModal}
            user={this.props.user}/>
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
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  children: React.PropTypes.node,
  fetchAccountData: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  location: React.PropTypes.object,
  notification: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  routes: React.PropTypes.array,
  theme: React.PropTypes.string,
  uiActions: React.PropTypes.object,
  user: React.PropTypes.instanceOf(Immutable.Map),
  userActions: React.PropTypes.object,
  username: React.PropTypes.string,
  viewingChart: React.PropTypes.bool
}

Main.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  properties: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activePurge: state.purge.get('activePurge'),
    fetching: state.account.get('fetching') ||
      state.content.get('fetching') ||
      state.group.get('fetching') ||
      state.host.get('fetching') ||
      state.topo.get('fetching') ||
      state.traffic.get('fetching') ||
      state.visitors.get('fetching'),
    notification: state.ui.get('notification'),
    properties: state.host.get('allHosts'),
    showErrorDialog: state.ui.get('showErrorDialog'),
    showInfoDialog: state.ui.get('showInfoDialog'),
    infoDialogOptions: state.ui.get('infoDialogOptions'),
    theme: state.ui.get('theme'),
    user: state.user,
    username: state.user.get('username'),
    viewingChart: state.ui.get('viewingChart'),
    breadcrumbs: state.ui.get('breadcrumbs')
  };
}

function mapDispatchToProps(dispatch) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch);
  const groupActions = bindActionCreators(groupActionCreators, dispatch);

  function fetchAccountData(account, accounts) {
    if(accounts && accounts.isEmpty()) {
      accountActions.fetchAccounts('udn')
    }
    if(account) {
      accountActions.fetchAccount('udn', account)
      groupActions.fetchGroups('udn', account)
    }
  }

  return {
    accountActions: accountActions,
    groupActions: groupActions,
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    fetchAccountData: fetchAccountData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
