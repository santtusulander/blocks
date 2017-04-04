import React from 'react'
import Icon from '../icon.jsx'

const IconEye = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M18,14.5A3.5,3.5,0,1,0,21.5,18,3.54,3.54,0,0,0,18,14.5Z"/>
        <path d="M28.9,17s-4.1-6.4-11.1-6.3S7.1,17,7.1,17a2.33,2.33,0,0,0,0,2s4,6.4,11.1,6.3c6.9-.1,10.7-6.3,10.7-6.3A2.33,2.33,0,0,0,28.9,17ZM18,23.1A5.1,5.1,0,1,1,23.1,18,5.12,5.12,0,0,1,18,23.1Z"/>
      </g>
    </Icon>
  )
}

IconEye.displayName = "IconEye"
IconEye.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconEye
