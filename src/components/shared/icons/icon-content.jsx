import React from 'react'
import Icon from '../icon.jsx'

const IconContent = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M11,11H7V7h4V11z M20,7h-4v4h4V7z M29,7h-4v4h4V7z M11,16H7v4h4V16z M20,16h-4v4h4V16z M29,16h-4v4h4V16z M11,25H7v4h4V25z
          M20,25h-4v4h4V25z M29,25h-4v4h4V25z"/>
      </g>
    </Icon>
  )
}

IconContent.displayName = "IconContent"
IconContent.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconContent
