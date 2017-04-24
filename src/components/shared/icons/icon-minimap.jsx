import React from 'react'
import Icon from '../icon.jsx'

const IconMinimap = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <path d="M29,12v12H7V12H29 M31,10H5v16h26V10L31,10z"/>
    </Icon>
  )
}

IconMinimap.displayName = "IconMinimap"
IconMinimap.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconMinimap
