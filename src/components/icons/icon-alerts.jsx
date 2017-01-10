import React from 'react'
import Icon from '../icon.jsx'

const IconAlerts = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M18,30c2.2,0,3-1.8,3-3h-6C15,28.2,15.8,30,18,30z M25,22v-6c0-3.2-2-5.3-5-6V9c0-0.9-0.6-2-2-2s-2,1.1-2,2 v1c-3,0.7-5,2.8-5,6v6l-2,1v2h18v-2L25,22z"/>
      </g>
    </Icon>
  )
}

IconAlerts.displayName = "IconAlerts"
IconAlerts.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconAlerts
