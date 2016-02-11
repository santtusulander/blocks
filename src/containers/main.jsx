import React from 'react'
import { connect } from 'react-redux'

import Header from '../components/header'
import Footer from '../components/footer'

export class Main extends React.Component {
  render() {
    return (
      <div>
        <Header fetching={this.props.fetching}/>
        {this.props.children}
        <Footer/>
      </div>
    );
  }
}

Main.displayName = 'Main'
Main.propTypes = {
  children: React.PropTypes.node,
  fetching: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    fetching: state.account.get('fetching') ||
      state.content.get('fetching') ||
      state.group.get('fetching') ||
      state.host.get('fetching') ||
      state.topo.get('fetching') ||
      state.traffic.get('fetching') ||
      state.visitors.get('fetching')
  };
}

export default connect(mapStateToProps)(Main);
