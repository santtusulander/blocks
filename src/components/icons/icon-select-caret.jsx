import React from 'react'
import Icon from '../icon.jsx'

const IconSelectCaret = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M23,20l-5,5l-5-5H23z M23,17l-5-5l-5,5H23z"/>
      </g>
    </Icon>
  )
}

IconSelectCaret.displayName = "IconSelectCaret"
IconSelectCaret.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSelectCaret
