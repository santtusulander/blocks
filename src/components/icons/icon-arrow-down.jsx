import React from 'react'
import Icon from '../icon.jsx'

const IconArrowDown = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="12,15 18,21 24,15"/>
      </g>
    </Icon>
  )
}

IconArrowDown.displayName = "IconArrowDown"
IconArrowDown.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconArrowDown
