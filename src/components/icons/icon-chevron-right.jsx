import React from 'react'
import Icon from '../icon.jsx'

const IconChevronRight = (props) => {
  const {className, height, width} = props

  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M15.8,14h1.5l2.9,4l-2.9,4h-1.6l2.9-4L15.8,14z"/>
      </g>
    </Icon>
  )
}

IconChevronRight.displayName = "IconChevronRight"
IconChevronRight.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconChevronRight
