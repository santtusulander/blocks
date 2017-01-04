import React from 'react'
import Icon from '../icon.jsx'

const IconArrowLeft = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="15,18 21,24 21,12"/>
      </g>
    </Icon>
  )
}

IconArrowLeft.displayName = "IconArrowLeft"
IconArrowLeft.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconArrowLeft
