import React from 'react'
import Icon from '../icon.jsx'

const IconSpMarker = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 24 24">
      <path fill="#fabb00" transform="translate(2 2)" d="M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z"/>
    </Icon>
  )
}

IconSpMarker.displayName = "IconUser"
IconSpMarker.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSpMarker
