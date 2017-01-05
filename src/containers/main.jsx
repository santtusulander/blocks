import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as uiActionCreators from '../redux/modules/ui'
import * as userActionCreators from '../redux/modules/user'
import * as rolesActionCreators from '../redux/modules/roles'

import Header from './header'
import Navigation from '../components/navigation/navigation.jsx'
import Footer from '../components/footer'

import ModalWindow from '../components/modal'
import Notification from '../components/notification'
import LoadingSpinner from '../components/loading-spinner/loading-spinner'
import * as PERMISSIONS from '../constants/permissions.js'
import checkPermissions from '../util/permissions'

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.hideNotification = this.hideNotification.bind(this)
    this.notificationTimeout = null
  }
  componentWillMount() {
    // Validate token
    this.props.userActions.checkToken()
      .then(action => {
        if(action.error) {
          // Check token failed
          return false
        }

        this.props.userActions.fetchUser(action.payload.username)
        this.props.rolesActions.fetchRoles()

        const accountId = this.props.activeAccount && this.props.activeAccount.size
          ? this.props.activeAccount.get('id')
          : this.props.params.account

        this.fetchAccountData(accountId, this.props.accounts)
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
  logOut() {
    this.props.userActions.setLogin(false)

    this.props.userActions.logOut()
      .then(() => {
        // Log out, destroy store, and redirect to login page
        this.props.router.push('/login')
        this.props.userActions.destroyStore()
      })
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
    if ( this.props.user.get('loggedIn') === false || !this.props.currentUser.size || !this.props.roles.size ) {
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

    return (
      <div className={classNames}>
        <Navigation
          activeAccount={activeAccount}
          activeGroup={this.props.activeGroup}
          activeHost={this.props.activeHost}
          currentUser={this.props.currentUser}
          params={this.props.params}
          pathname={this.props.location.pathname}
          roles={this.props.roles}
          />

          <Header
            accounts={this.props.accounts}
            activeAccount={this.props.activeAccount}
            activeGroup={this.props.activeGroup}
            activeHost={this.props.activeHost}
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

        <div className="content-container">
          {this.props.children}
        </div>

            <Footer />

        {this.props.showErrorDialog &&
        <ModalWindow
          title={<FormattedMessage id="portal.errorModal.errorOccured.text"/>}
          content={<FormattedMessage id="portal.errorModal.reloadNote.text"/>}
          closeButtonSecondary={true}
          reloadButton={true}
          cancel={() => this.props.uiActions.hideErrorDialog()}
          submit={() => location.reload(true)}/>
        }
        {this.props.showInfoDialog &&
        <ModalWindow
          {...infoDialogOptions}/>
        }

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
  breadcrumbs: React.PropTypes.instanceOf(Immutable.Map),
  children: React.PropTypes.node,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  infoDialogOptions: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  notification: React.PropTypes.string,
  params: React.PropTypes.object,
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
  currentUser: Immutable.Map(),
  roles: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  const stateMap = Immutable.Map(state)

  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    currentUser: state.user.get('currentUser'),
    fetching: stateMap.some(
      store => store && (store.get ? store.get('fetching') : store.fetching)
    ),
    notification: state.ui.get('notification'),
    roles: state.roles.get('roles'),
    showErrorDialog: state.ui.get('showErrorDialog'),
    showInfoDialog: state.ui.get('showInfoDialog'),
    infoDialogOptions: state.ui.get('infoDialogOptions'),
    theme: state.ui.get('theme'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart'),
    breadcrumbs: state.ui.get('breadcrumbs')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    rolesActions: bindActionCreators(rolesActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));
