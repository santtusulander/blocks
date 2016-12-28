import React from 'react'
import Icon from '../icon.jsx'

const IconClose = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="24.7,12.7 23.3,11.3 18,16.6 12.7,11.3 11.3,12.7 16.6,18 11.3,23.3 12.7,24.7 18,19.4 23.3,24.7 24.7,23.3 19.4,18"/>
      </g>
    </Icon>
  )
}

IconClose.displayName = "IconClose"
IconClose.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconClose
