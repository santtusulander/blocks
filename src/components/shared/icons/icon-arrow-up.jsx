import React from 'react'
import Icon from '../icon.jsx'

const IconArrowUp = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="24,21 18,15 12,21"/>
      </g>
    </Icon>
  )
}

IconArrowUp.displayName = "IconArrowUp"
IconArrowUp.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconArrowUp
