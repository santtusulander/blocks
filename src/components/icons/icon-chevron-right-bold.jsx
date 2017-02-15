import React from 'react'
import Icon from '../icon.jsx'

const IconChevronRightBold = (props) => {
  const {className, height, width} = props

  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M15.6,13.8h2.3l2.6,4.2l-2.6,4.2h-2.3l2.6-4.2L15.6,13.8z"/>
      </g>
    </Icon>
  )
}

IconChevronRightBold.displayName = "IconChevronRightBold"
IconChevronRightBold.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconChevronRightBold
