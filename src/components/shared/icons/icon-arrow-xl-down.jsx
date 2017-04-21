import React from 'react'
import Icon from '../icon.jsx'

const IconArrowXlDown = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="23,16.1 23,5.4 13,5.4 13,16.1 5.2,16.1 18,30.6 30.8,16.1"/>
      </g>
    </Icon>
  )
}

IconArrowXlDown.displayName = "IconArrowXlDown"
IconArrowXlDown.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconArrowXlDown
