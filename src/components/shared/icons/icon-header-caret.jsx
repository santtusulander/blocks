import React from 'react'
import Icon from '../icon.jsx'

const IconHeaderCaret = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="18,24.7 6.7,13.5 8.1,12 18,21.8 27.9,12 29.3,13.5"/>
      </g>
    </Icon>
  )
}

IconHeaderCaret.displayName = "IconHeaderCaret"
IconHeaderCaret.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconHeaderCaret
