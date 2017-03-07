import React from 'react'
import Icon from '../icon.jsx'

const IconClock = (props) => {
  const {className, height, width} = props

  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
    <g>
      <polygon points="17.2,24 11.4,19.1 12.5,17.8 16.9,21.5 23.2,12 24.6,12.9"/>
    </g>
    </Icon>
  )
}

IconClock.displayName = "IconClock"
IconClock.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconClock
