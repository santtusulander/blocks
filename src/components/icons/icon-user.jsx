import React from 'react'
import Icon from '../icon.jsx'

const IconUser = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M18,1.2c9.3,0,16.8,7.5,16.8,16.8S27.3,34.8,18,34.8S1.2,27.3,1.2,18S8.7,1.2,18,1.2 M18,0C8.1,0,0,8.1,0,18s8.1,18,18,18
          s18-8.1,18-18S27.9,0,18,0L18,0z M18,9.8c-2.4,0-4.4,2-4.4,4.4s2,4.4,4.4,4.4s4.4-2,4.4-4.4S20.4,9.8,18,9.8z M18,31.8
          c3.9,0,7.4-1.6,9.9-4.2c0,0-3.1-7-9.9-7s-9.9,7-9.9,7C10.6,30.1,14.1,31.8,18,31.8z"/>
      </g>
    </Icon>
  )
}

IconUser.displayName = "IconUser"
IconUser.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconUser
