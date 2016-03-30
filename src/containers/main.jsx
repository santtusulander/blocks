import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as uiActionCreators from '../redux/modules/ui'
import * as purgeActionCreators from '../redux/modules/purge'
import * as userActionCreators from '../redux/modules/user'
import * as hostActionCreators from '../redux/modules/host'

import Header from '../components/header'
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
    this.props.history.pushState(null, '/login')
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
    if(this.props.viewingChart) {
      classNames = `${classNames} chart-view`
    }
    const firstProperty = this.props.properties && this.props.properties.size ?
      this.props.properties.get(0)
      : null
    return (
      <div className={classNames}>
        {this.props.location.pathname !== '/login' ?
          <Header
            accounts={this.props.accounts}
            activeAccount={this.props.activeAccount}
            activeGroup={this.props.activeGroup}
            activeHost={this.props.activeHost}
            activatePurge={this.activatePurge(firstProperty)}
            fetching={this.props.fetching}
            theme={this.props.theme}
            handleThemeChange={this.props.uiActions.changeTheme}
            logOut={this.logOut}
            location={this.props.location}
            pathname={this.props.location.pathname}
            params={this.props.params}/>
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
  fetching: React.PropTypes.bool,
  history: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  location: React.PropTypes.object,
  notification: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  theme: React.PropTypes.string,
  uiActions: React.PropTypes.object,
  userActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
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
    theme: state.ui.get('theme'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
