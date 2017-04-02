import React from 'react'

class Content extends React.Component {
  render() {
    let className = 'content-layout';
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
Content.displayName = 'Content'
Content.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

module.exports = Content
