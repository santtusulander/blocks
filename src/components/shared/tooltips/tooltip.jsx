import React from 'react';

class Tooltip extends React.Component {
  render() {
    let className = 'chart-tooltip';
    if (this.props.className) {
      className = className + ' ' + this.props.className;
    }
    if (this.props.offsetTop) {
      className = className + ' offset-top'
    }

    if (this.props.offsetLeft) {
      className = className + ' offset-left'
    }

    if (this.props.hidden) {
      return (
        <div className={`${className} hidden`} />
      );
    }
    return (
      <div className={className} style={{top: this.props.y, left: this.props.x}}>
        {this.props.children}
      </div>
    );
  }
}
Tooltip.displayName = 'Tooltip'
Tooltip.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  hidden: React.PropTypes.bool,
  offsetLeft: React.PropTypes.bool,
  offsetTop: React.PropTypes.bool,
  x: React.PropTypes.number,
  y: React.PropTypes.number
};

module.exports = Tooltip;
