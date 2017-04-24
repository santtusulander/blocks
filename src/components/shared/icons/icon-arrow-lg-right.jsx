import React from 'react'
import Icon from '../icon.jsx'

const IconArrowRight = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="11,8.5 25,17.5 11,27.5"/>
      </g>
    </Icon>
  )
}

IconArrowRight.displayName = "IconArrowRight"
IconArrowRight.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconArrowRight
