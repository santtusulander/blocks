import React from 'react'

class Sidebar extends React.Component {
  render() {
    let className = 'sidebar-layout';
    if (this.props.className) {
      className = className + ' ' + this.props.className;
    }
    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
}
Sidebar.displayName = 'Sidebar'
Sidebar.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

module.exports = Sidebar
