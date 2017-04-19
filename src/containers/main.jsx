import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { Map, List } from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as uiActionCreators from '../redux/modules/ui'
import * as userActionCreators from '../redux/modules/user'

import accountsActions from '../redux/modules/entities/accounts/actions'
import { getById as getAccountById, getByBrand as getAccountsByBrand} from '../redux/modules/entities/accounts/selectors'

import groupsActions from '../redux/modules/entities/groups/actions'
import { getById as getGroupById } from '../redux/modules/entities/groups/selectors'

import propertiesActions from '../redux/modules/entities/properties/actions'
import { getById as getPropertyById } from '../redux/modules/entities/properties/selectors'

import rolesActions from '../redux/modules/entities/roles/actions'
import { getAll as getRoles } from '../redux/modules/entities/roles/selectors'

import { getGlobalFetching } from '../redux/modules/fetching/selectors'


import Header from './header'
import Navigation from '../components/navigation/navigation.jsx'
import Footer from '../components/shared/layout/footer'

import ModalWindow from '../components/shared/modal'
import Notification from '../components/shared/notification-wrappers/notification'
import BannerNotification from '../components/shared/notification-wrappers/banner-notification'
import AsperaNotification from '../components/storage/aspera-notification'
import LoadingSpinner from '../components/loading-spinner/loading-spinner'

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.hideNotification = this.hideNotification.bind(this)
    this.hideAsperaNotification = this.hideAsperaNotification.bind(this)
    this.notificationTimeout = null
  }

  getChildContext() {
    return {
      currentUser: this.props.currentUser,
      location: this.props.location,
      params: this.props.params,
      roles: this.props.roles
    }
  }

  componentWillMount() {
    // Validate token
    this.props.userActions.checkToken()
      .then(action => {
        if (action.error) {
          // Check token failed
          return false
        }

        this.fetchData(this.props.params)

        return this.props.userActions.fetchUser(action.payload.username)
          .then(() => {

            /* Fetch permissions for currentUser */
            const currentUser = this.props.currentUser
            const currentRoles = currentUser && currentUser.get('roles')

            currentRoles.map(id => {
              return this.props.fetchRole(id)
            })
          })

      })
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.params)
  }

  fetchData(params) {
    const {brand,account,group,property} = params

    /* If account / group / property -params set -> load data ( needed for breadcrumb ) */
    if (account) {
      this.props.fetchAccount({brand, id: account})
    }

    if (group) {
      this.props.fetchGroup({brand, account, id: group})
    }

    if (property) {
      this.props.fetchProperty({brand, account, group, id: property})
    }

  }

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

  hideBannerNotification() {
    this.props.uiActions.changeBannerNotification()
  }

  render() {
    if (this.props.user.get('loggedIn') === false || !this.props.currentUser.size || !this.props.roles.size) {
      return <LoadingSpinner />
    }

    const infoDialogOptions = this.props.infoDialogOptions ? this.props.infoDialogOptions.toJS() : {}

    let classNames = 'main-container';

    if (this.props.viewingChart) {
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

        <ReactCSSTransitionGroup
          component="div"
          className="banner-notification-transition"
          transitionName="banner-notification-transition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={500}
          transitionAppear={true}
          transitionAppearTimeout={1000}>
          {this.props.bannerNotification ?
            <BannerNotification
              handleClose={this.hideBannerNotification}
              notificationCode={this.props.bannerNotification}
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
  bannerNotification: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  breadcrumbs: PropTypes.instanceOf(Map),
  children: PropTypes.node,
  currentUser: PropTypes.instanceOf(Map),
  fetchAccount: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchProperty: PropTypes.func,
  fetchRole: PropTypes.func,
  fetching: PropTypes.bool,
  infoDialogOptions: PropTypes.instanceOf(Map),
  location: PropTypes.object,
  notification: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  params: PropTypes.object,
  roles: PropTypes.instanceOf(Map),
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
  roles: Map(),
  user: Map()
}

Main.childContextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  location: PropTypes.object,
  params: PropTypes.object,
  roles: PropTypes.instanceOf(Map)
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {

  const {brand = 'udn', account, group, property } = ownProps.params
  const {entities, ...rest} = state

  const stateMap = Map(rest)
  const fetching = stateMap.some(
    store => store && (store.get ? store.get('fetching') : store.fetching)
  ) || getGlobalFetching({entities})

  return {
    accounts: getAccountsByBrand(state, brand),
    activeAccount: getAccountById(state, account),
    activeGroup: getGroupById(state, group),
    activeHost: getPropertyById(state, property),

    asperaNotification: state.ui.get('asperaNotification'),
    bannerNotification: state.ui.get('bannerNotification'),
    currentUser: state.user.get('currentUser'),
    fetching,
    notification: state.ui.get('notification'),
    roles: getRoles(state),
    showErrorDialog: state.ui.get('showErrorDialog'),
    showInfoDialog: state.ui.get('showInfoDialog'),
    infoDialogOptions: state.ui.get('infoDialogOptions'),
    theme: state.ui.get('theme'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart'),
    breadcrumbs: state.ui.get('breadcrumbs')
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),

    fetchRole: (id) => dispatch(rolesActions.fetchOne({id})),

    fetchAccount: (params) => dispatch(accountsActions.fetchOne(params)),
    fetchGroup: (params) => dispatch(groupsActions.fetchOne(params)),
    fetchProperty: (params) => dispatch(propertiesActions.fetchOne(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));
