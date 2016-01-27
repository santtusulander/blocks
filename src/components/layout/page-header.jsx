import React from 'react'

class PageHeader extends React.Component {
  render() {
    let className = 'page-header-layout';
    if(this.props.className) {
      className = className + ' ' + this.props.className;
    }
    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
}
PageHeader.displayName = 'PageHeader'
PageHeader.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

module.exports = PageHeader
