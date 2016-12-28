import React from 'react'
import Icon from '../icon.jsx'

const IconAnalytics = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M8,18v11H4V18H8z M12,7v22h4V7H12z M20,13v16h4V13H20z M28,8v21h4V8H28z"/>
      </g>
    </Icon>
  )
}

IconAnalytics.displayName = "IconAnalytics"
IconAnalytics.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconAnalytics
