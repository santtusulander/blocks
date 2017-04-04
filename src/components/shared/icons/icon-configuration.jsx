import React from 'react'
import Icon from '../icon.jsx'

const IconConfiguration = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M25.2,16.8h-1.9c-0.1-0.6-0.4-1.2-0.7-1.7l1.4-1.4c0.2-0.2,0.2-0.6,0-0.8l-0.8-0.8
          c-0.2-0.2-0.6-0.2-0.8,0l-1.4,1.4c-0.5-0.3-1.1-0.6-1.7-0.7v-1.9c0-0.3-0.3-0.6-0.6-0.6h-1.2c-0.3,0-0.6,0.3-0.6,0.6v1.9
          c-0.6,0.1-1.2,0.4-1.7,0.7l-1.4-1.4c-0.2-0.2-0.6-0.2-0.8,0l-0.8,0.9c-0.2,0.2-0.2,0.6,0,0.8l1.4,1.4c-0.3,0.5-0.6,1.1-0.7,1.7
          h-1.9c-0.3,0-0.6,0.3-0.6,0.6v1.2c0,0.3,0.3,0.6,0.6,0.6h1.9c0.1,0.6,0.4,1.2,0.7,1.7l-1.4,1.4c-0.2,0.2-0.2,0.6,0,0.8l0.8,0.9
          c0.2,0.2,0.6,0.2,0.8,0l1.4-1.4c0.5,0.3,1.1,0.6,1.7,0.7v1.9c0,0.3,0.3,0.6,0.6,0.6h1.2c0.3,0,0.6-0.3,0.6-0.6v-1.9
          c0.6-0.1,1.2-0.4,1.7-0.7l1.4,1.4c0.2,0.2,0.6,0.2,0.8,0l0.8-0.8c0.2-0.2,0.2-0.6,0-0.8l-1.4-1.4c0.3-0.5,0.6-1.1,0.7-1.7h1.9
          c0.3,0,0.6-0.3,0.6-0.6v-1.2C25.8,17.1,25.5,16.8,25.2,16.8z M18,21c-1.7,0-3-1.3-3-3c0-1.7,1.3-3,3-3c1.7,0,3,1.3,3,3
          C21,19.7,19.7,21,18,21z"/>
      </g>
    </Icon>
  )
}

IconConfiguration.displayName = "IconConfiguration"
IconConfiguration.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconConfiguration
