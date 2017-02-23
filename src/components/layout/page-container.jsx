import React from 'react'

class PageContainer extends React.Component {
  render() {
    let className = 'page-container';
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (
      <div ref={ref => this.pageContainerRef = ref} className={className}>
        {this.props.children}
      </div>
    )
  }
}

PageContainer.displayName = 'PageContainer'
PageContainer.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

module.exports = PageContainer
