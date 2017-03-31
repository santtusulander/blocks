import React from 'react'
import Icon from '../icon.jsx'

// TODO: UDNP-3022 Replace placeholder with icon for 'Clock'
const IconClock = (props) => {
  const {className, height, width} = props

  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M18,27.4c-5.2,0-9.4-4.2-9.4-9.4s4.2-9.4,9.4-9.4s9.4,4.2,9.4,9.4S23.2,27.4,18,27.4z M18,9.6c-4.7,0-8.4,3.8-8.4,
        8.4s3.8,8.4,8.4,8.4s8.4-3.8,8.4-8.4S22.7,9.6,18,9.6z M23,18h-5v-6h-1v7h6V18z"/>
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
