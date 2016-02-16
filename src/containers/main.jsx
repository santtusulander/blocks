import React from 'react'
import { connect } from 'react-redux'

import Header from '../components/header'

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
          fetching={this.props.fetching}/>
        <div className="content-container">{this.props.children}</div>
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

export default connect(mapStateToProps)(Main);
