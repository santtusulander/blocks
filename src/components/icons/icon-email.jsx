import React from 'react'
import Icon from '../icon.jsx'

const IconEmail = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M18,21.1L18,21.1L18,21.1L6,13v12h24V13L18,21.1z M30,10H6l12,8L30,10z"/>
      </g>
    </Icon>
  )
}

IconEmail.displayName = "IconEmail"
IconEmail.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconEmail
