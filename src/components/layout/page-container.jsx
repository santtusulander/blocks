import React from 'react'

import Footer from '../footer'

class PageContainer extends React.Component {
  render() {
    let className = 'page-container-layout';
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    if(this.props.hasSidebar){
      className = className + ' has-sidebar'
    }
    return (
      <div className={className}>
        {this.props.children}
        <Footer/>
      </div>
    )
  }
}

PageContainer.displayName = 'PageContainer'
PageContainer.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  hasSidebar: React.PropTypes.bool
};

module.exports = PageContainer
