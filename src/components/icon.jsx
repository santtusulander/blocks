import React from 'react'

class Icon extends React.Component {
  render() {
    let className = 'icon';
    if(this.props.className) {
      className = className + ' ' + this.props.className;
    }
    return (
      <svg className={className}
        xmlns="http://www.w3.org/svg/2000"
        viewBox={'0 0 ' +  this.props.width + ' ' + this.props.height}
        width={this.props.width}
        height={this.props.height}>
        {this.props.children}
      </svg>
    );
  }
}

Icon.displayName = 'Icon'
Icon.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  height: React.PropTypes.string,
  width: React.PropTypes.string
}

module.exports = Icon
