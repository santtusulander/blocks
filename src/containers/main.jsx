import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as uiActionCreators from '../redux/modules/ui'

import Header from '../components/header'
import Footer from '../components/footer'

export class Main extends React.Component {
  render() {
    const currentRoute = this.props.routes[this.props.routes.length-1].path
    let classNames = 'main-container';
    if(this.props.theme) {
      classNames = `${classNames} ${this.props.theme}-theme`
    }
    if(this.props.viewingChart) {
      classNames = `${classNames} chart-view`
    }
    return (
      <div className={classNames}>
        <Header className={currentRoute === 'login' ? 'hidden' : ''}
          fetching={this.props.fetching}
          theme={this.props.theme}
          handleThemeChange={this.props.uiActions.changeTheme}/>
        {this.props.children}
        <Footer className={currentRoute === 'login' ? 'hidden' : ''}/>
      </div>
    );
  }
}

Main.displayName = 'Main'
Main.propTypes = {
  children: React.PropTypes.node,
  fetching: React.PropTypes.bool,
  routes: React.PropTypes.array,
  theme: React.PropTypes.string,
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    fetching: state.account.get('fetching') ||
      state.content.get('fetching') ||
      state.group.get('fetching') ||
      state.host.get('fetching') ||
      state.topo.get('fetching') ||
      state.traffic.get('fetching') ||
      state.visitors.get('fetching'),
    theme: state.ui.get('theme'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
