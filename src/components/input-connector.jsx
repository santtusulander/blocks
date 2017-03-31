import React from 'react';

class InputConnector extends React.Component {
  render() {
    let className = 'input-connector'
    if (this.props.show) {
      className += ' show'
    }
    if (this.props.hasTwoEnds) {
      className += ' has-two-ends'
    }
    if (this.props.noLabel) {
      className += ' no-label'
    }
    if (this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <div className={className} />
    );
  }
}
InputConnector.displayName = 'InputConnector'
InputConnector.propTypes = {
  className: React.PropTypes.string,
  hasTwoEnds: React.PropTypes.bool,
  noLabel: React.PropTypes.bool,
  show: React.PropTypes.bool
};

module.exports = InputConnector
