import React from 'react'
import Icon from '../icon.jsx'

const IconArrowLgUp = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="8.5,24.9 17.5,10.9 27.5,24.9"/>
      </g>
    </Icon>
  )
}

IconArrowLgUp.displayName = "IconArrowLgUp"
IconArrowLgUp.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconArrowLgUp
