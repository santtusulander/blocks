import React from 'react'
import Icon from '../icon.jsx'

const IconDashboard = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M8.4,19.1h8.5V8.4H8.4V19.1z M8.4,27.6h8.5v-6.4H8.4V27.6z M19.1,27.6h8.5V16.9h-8.5V27.6z M19.1,8.4v6.4h8.5 V8.4H19.1z"/>
      </g>
    </Icon>
  )
}

IconDashboard.displayName = "IconDashboard"
IconDashboard.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconDashboard
