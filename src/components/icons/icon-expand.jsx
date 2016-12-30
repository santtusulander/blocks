import React from 'react'
import Icon from '../icon.jsx'

const IconExpand = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <path d="M26.4,16.8l-2.7-2.7l-0.1,0.1l-3.1,3l-1.7-1.7l3.1-3l0.1-0.1l-2.8-2.8h7.2V16.8z M17.1,20.5l-1.7-1.7l-3.2,3l-2.6-2.6v7.2
        h7.2l-2.9-2.9L17.1,20.5z"/>
    </Icon>
  )
}

IconExpand.displayName = "IconExpand"
IconExpand.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconExpand
