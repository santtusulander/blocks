import React from 'react'

import Header from '../components/header'
import Footer from '../components/footer'

class Main extends React.Component {
  render() {
    const currentRoute = this.props.routes[this.props.routes.length-1].path
    return (
      <div className="main-content-wrapper">
        <Header className={currentRoute === 'login' ? 'hidden' : ''}/>
        <div className="content-container">{this.props.children}</div>
        <Footer className={currentRoute === 'login' ? 'hidden' : ''}/>
      </div>
    );
  }
}

Main.displayName = 'Main'
Main.propTypes = {
  children: React.PropTypes.node,
  routes: React.PropTypes.array
}

module.exports = Main
