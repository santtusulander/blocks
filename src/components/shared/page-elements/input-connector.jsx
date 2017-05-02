import React from 'react';

const InputConnector = (props) => {
  let className = 'input-connector'
  if (props.show) {
    className += ' show'
  }
  if (props.hasTwoEnds) {
    className += ' has-two-ends'
  }
  if (props.noLabel) {
    className += ' no-label'
  }
  if (props.className) {
    className += ' ' + props.className
  }

  return (
    <div className={className} />
  )
}

InputConnector.displayName = 'InputConnector'
InputConnector.propTypes = {
  className: React.PropTypes.string,
  hasTwoEnds: React.PropTypes.bool,
  noLabel: React.PropTypes.bool,
  show: React.PropTypes.bool
}

export default InputConnector
