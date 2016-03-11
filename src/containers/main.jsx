import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Immutable from 'immutable'

import * as uiActionCreators from '../redux/modules/ui'
import * as purgeActionCreators from '../redux/modules/purge'
import * as userActionCreators from '../redux/modules/user'

import Header from '../components/header'
import PurgeModal from '../components/purge-modal'
import Notification from '../components/notification'

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePurge: null,
      notificationOpen: false
    }

    this.activatePurge = this.activatePurge.bind(this)
    this.saveActivePurge = this.saveActivePurge.bind(this)
    this.changePurge = this.changePurge.bind(this)
    this.logOut = this.logOut.bind(this)
    this.closeNotification = this.closeNotification.bind(this)
  }
  activatePurge(index) {
    return e => {
      if(e) {
        e.preventDefault()
      }
      this.setState({activePurge: index})
      this.props.purgeActions.resetActivePurge()
    }
  }
  changePurge(index) {
    this.setState({activePurge: parseInt(index)})
    this.props.purgeActions.resetActivePurge()
  }
  saveActivePurge() {
    const purgeProperty = this.props.properties.get(this.state.activePurge)
    this.props.purgeActions.createPurge(
      'udn',
      purgeProperty.get('account_id'),
      purgeProperty.get('group_id'),
      purgeProperty.get('property'),
      this.props.activePurge.toJS()
    ).then(() => this.setState({activePurge: null}))
  }
  logOut() {
    this.props.userActions.logOut()
    this.props.history.pushState(null, '/login')
  }
  closeNotification() {
    this.setState({
      notificationOpen: false
    })
  }
  render() {
    const currentRoute = this.props.routes[this.props.routes.length-1].path
    let classNames = 'main-container';
    if(this.props.viewingChart) {
      classNames = `${classNames} chart-view`
    }
    return (
      <div className={classNames}>
        <Header className={currentRoute === '/login' ? 'hidden' : ''}
          activatePurge={this.activatePurge(-1)}
          fetching={this.props.fetching}
          theme={this.props.theme}
          handleThemeChange={this.props.uiActions.changeTheme}
          logOut={this.logOut}/>
        <div className="content-container">{this.props.children}</div>
        {this.state.activePurge !== null ?
          <PurgeModal
            activeProperty={this.state.activePurge}
            activePurge={this.props.activePurge}
            availableProperties={this.props.properties}
            changeProperty={this.changePurge}
            changePurge={this.props.purgeActions.updateActivePurge}
            hideAction={this.activatePurge(null)}
            savePurge={this.saveActivePurge}/>
          : ''
        }
        {this.state.notificationOpen ?
          <Notification handleClose={this.closeNotification}>
            Notification content
          </Notification>
          : ''
        }
      </div>
    );
  }
}

Main.displayName = 'Main'
Main.propTypes = {
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  children: React.PropTypes.node,
  fetching: React.PropTypes.bool,
  history: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  routes: React.PropTypes.array,
  theme: React.PropTypes.string,
  uiActions: React.PropTypes.object,
  userActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activePurge: state.purge.get('activePurge'),
    fetching: state.account.get('fetching') ||
      state.content.get('fetching') ||
      state.group.get('fetching') ||
      state.host.get('fetching') ||
      state.topo.get('fetching') ||
      state.traffic.get('fetching') ||
      state.visitors.get('fetching'),
    properties: state.content.get('properties'),
    theme: state.ui.get('theme'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
