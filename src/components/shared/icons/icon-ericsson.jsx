import React from 'react'
import Icon from '../icon.jsx'

const IconEricsson = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M11.9,15.4c-1.3,0.5-2.8-0.2-3.2-1.5c-0.5-1.3,0.2-2.8,1.5-3.2l14-5.1
          C25.4,5,26.9,5.7,27.3,7c0.5,1.3-0.2,2.8-1.5,3.2L11.9,15.4z M25.8,17.8c1.3-0.5,2-1.9,1.5-3.2c-0.5-1.3-1.9-2-3.2-1.5l-14,5.1
          c-1.3,0.5-2,1.9-1.5,3.2c0.5,1.3,1.9,2,3.2,1.5L25.8,17.8z M25.8,25.4c1.3-0.5,2-1.9,1.5-3.2c-0.5-1.3-1.9-2-3.2-1.5l-14,5.1
          c-1.3,0.5-2,1.9-1.5,3.2c0.5,1.3,1.9,2,3.2,1.5L25.8,25.4z"/>
      </g>
    </Icon>
  )
}

IconEricsson.displayName = "IconEricsson"
IconEricsson.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconEricsson
