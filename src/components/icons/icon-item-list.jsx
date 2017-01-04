import React from 'react'
import Icon from '../icon.jsx'

const IconItemList = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M9.2,13.9h18v-3h-18V13.9z M9.2,19.9h18v-3h-18V19.9z M9.2,25.9h18v-3h-18V25.9z"/>
      </g>
    </Icon>
  )
}

IconItemList.displayName = "IconItemList"
IconItemList.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconItemList
