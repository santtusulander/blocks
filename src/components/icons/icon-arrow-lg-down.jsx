import React from 'react'
import Icon from '../icon.jsx'

const IconArrowLgDown = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="27.5,11 18.5,25 8.5,11"/>
      </g>
    </Icon>
  )
}

IconArrowLgDown.displayName = "IconArrowLgDown"
IconArrowLgDown.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconArrowLgDown
