import React from 'react';

const Tooltip = (props) => {
  let className = 'chart-tooltip'

  if (props.className) {
    className = className + ' ' + props.className;
  }

  if (props.offsetTop) {
    className = className + ' offset-top'
  }

  if (props.offsetLeft) {
    className = className + ' offset-left'
  }

  if (props.hidden) {
    return (
      <div className={`${className} hidden`} />
    )
  }

  return (
    <div className={className} style={{top: props.y, left: props.x}}>
      {props.children}
    </div>
  )
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
}

export default Tooltip
