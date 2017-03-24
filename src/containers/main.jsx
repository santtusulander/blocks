import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { Map, List } from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

//import * as accountActionCreators from '../redux/modules/account'
//import * as groupActionCreators from '../redux/modules/group'
import * as uiActionCreators from '../redux/modules/ui'
import * as userActionCreators from '../redux/modules/user'
import * as rolesActionCreators from '../redux/modules/roles'

import { getById as getAccountById, getByBrand as getAccountsByBrand} from '../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../redux/modules/entities/groups/selectors'
import { getById as getPropertyById } from '../redux/modules/entities/properties/selectors'

import { getGlobalFetching } from '../redux/modules/fetching/selectors'

import Header from './header'
import Navigation from '../components/navigation/navigation.jsx'
import Footer from '../components/footer'

import ModalWindow from '../components/modal'
import Notification from '../components/notification'
import AsperaNotification from '../components/storage/aspera-notification'
import LoadingSpinner from '../components/loading-spinner/loading-spinner'
import {
  ENTRY_ROUTE_ROOT,
  ENTRY_ROUTE_DEFAULT,
  ENTRY_ROUTE_SERVICE_PROVIDER
} from '../constants/routes.js'
import * as PERMISSIONS from '../constants/permissions.js'
import checkPermissions from '../util/permissions'
import { userIsServiceProvider } from '../util/helpers'

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.hideNotification = this.hideNotification.bind(this)
    this.hideAsperaNotification = this.hideAsperaNotification.bind(this)
    this.notificationTimeout = null
  }

  getChildContext(){
    return {
      currentUser: this.props.currentUser,
      roles: this.props.roles
    }
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

        //this.props.router.push('')
        // const accountId = this.props.activeAccount && this.props.activeAccount.size
        //   ? this.props.activeAccount.get('id')
        //   : this.props.params.account
        //
        // this.fetchAccountData(accountId, this.props.accounts)
      })
  }

  // //update account if account prop changed (in url) or clear active if there is no account in route
  // componentWillReceiveProps(nextProps){
  //   const { user, accounts, location, params: { account } } = this.props
  //   const nextCurrentUser = nextProps.user.get('currentUser')
  //   const isAccessingRootRoute = location.pathname === ENTRY_ROUTE_ROOT
  //   const currentUserChanged = !user.get('currentUser').equals(nextCurrentUser)
  //   const currentUserExists = !!nextCurrentUser.size
  //   const accountChanged = account !== nextProps.params.account
  //
  //   !nextProps.params.account && nextProps.accountActions.clearActiveAccount()
  //   if (accountChanged) {
  //     this.fetchAccountData(nextProps.params.account, accounts)
  //   }
  //
  //   if (currentUserChanged && currentUserExists && isAccessingRootRoute) {
  //     const entryPath = userIsServiceProvider(nextCurrentUser) ? ENTRY_ROUTE_SERVICE_PROVIDER : ENTRY_ROUTE_DEFAULT
  //     this.props.router.push(entryPath)
  //   }
  // }
  // fetchAccountData(account, accounts) {
  //   if(accounts && accounts.isEmpty() && checkPermissions(
  //     this.props.roles,
  //     this.props.currentUser,
  //     PERMISSIONS.VIEW_CONTENT_ACCOUNTS
  //   )) {
  //     this.props.accountActions.fetchAccounts('udn')
  //   }
  //   if(account) {
  //     this.props.accountActions.fetchAccount('udn', account)
  //     this.props.groupActions.fetchGroups('udn', account)
  //   }
  // }

  logOut() {
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

  hideAsperaNotification() {
    this.props.uiActions.changeAsperaNotification()
  }

  render() {
    if ( this.props.user.get('loggedIn') === false || !this.props.currentUser.size || !this.props.roles.size ) {
      return <LoadingSpinner />
    }

    const infoDialogOptions = this.props.infoDialogOptions ? this.props.infoDialogOptions.toJS() : {}

    let classNames = 'main-container';

    if(this.props.viewingChart) {
      classNames = `${classNames} chart-view`
    }

    return (
      <div className={classNames}>
        <Navigation
          activeAccount={this.props.activeAccount}
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
          onSubmit={() => location.reload(true)}/>
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

        <ReactCSSTransitionGroup
          component="div"
          className="aspera-notification-transition"
          transitionName="aspera-notification-transition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={500}
          transitionAppear={true}
          transitionAppearTimeout={1000}>
          {this.props.asperaNotification ?
            <AsperaNotification
              handleClose={this.hideAsperaNotification}
              status={this.props.asperaNotification}
            />
            : ''
          }
        </ReactCSSTransitionGroup>

      </div>
    );
  }
}

Main.displayName = 'Main'
Main.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  activeGroup: PropTypes.instanceOf(Map),
  activeHost: PropTypes.instanceOf(Map),
  asperaNotification: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  breadcrumbs: PropTypes.instanceOf(Map),
  children: PropTypes.node,
  currentUser: PropTypes.instanceOf(Map),
  fetching: PropTypes.bool,
  infoDialogOptions: PropTypes.instanceOf(Map),
  location: PropTypes.object,
  notification: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  params: PropTypes.object,
  roles: PropTypes.instanceOf(List),
  rolesActions: PropTypes.object,
  router: PropTypes.object,
  routes: PropTypes.array,
  showErrorDialog: PropTypes.bool,
  showInfoDialog: PropTypes.bool,
  theme: PropTypes.string,
  uiActions: PropTypes.object,
  user: PropTypes.instanceOf(Map),
  userActions: PropTypes.object,
  viewingChart: PropTypes.bool
}

Main.defaultProps = {
  accounts: List(),
  activeAccount: Map(),
  activeGroup: Map(),
  activeHost: Map(),
  currentUser: Map(),
  roles: List(),
  user: Map()
}

Main.childContextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List)
}

const mapStateToProps = (state, ownProps) => {

  const {brand = 'udn', account, group, property /*, storage*/} = ownProps.params
  const {entities, ...rest} = state


  const stateMap = Map(rest)
  const fetching = stateMap.some(
    store => store && (store.get ? store.get('fetching') : store.fetching)
  ) || getGlobalFetching({entities, ...state})

  return {
    accounts: getAccountsByBrand(state, brand),
    activeAccount: getAccountById(state, account),
    activeGroup: getGroupById(state, group),
    activeHost: getPropertyById(state, property),

    asperaNotification: state.ui.get('asperaNotification'),
    currentUser: state.user.get('currentUser'),
    fetching,
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

const mapDispatchToProps = (dispatch) => {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    rolesActions: bindActionCreators(rolesActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));
