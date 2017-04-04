import React from 'react'
import Icon from '../icon.jsx'

const IconComments = (props) => {
  const {className, count, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 35 32">
      <g>
        <polygon points="35 0 0 0 0 23 7 23 7 32 16 23 35 23 35 0" className="base"/>
        <text x="17" y="17" textAnchor="middle" className="primary">{count}</text>
      </g>
    </Icon>
  )
}

IconComments.displayName = "IconComments"
IconComments.propTypes = {
  className: React.PropTypes.string,
  count: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconComments
