import React from 'react'
import Icon from '../icon.jsx'

const IconPassword = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M19.8,16.2c0.6-2.2,0-4.6-1.7-6.3c-2.5-2.5-6.6-2.5-9.2,0c-2.5,2.5-2.5,6.6,0,9.2c1.7,1.7,4.2,2.3,6.4,1.6
          l1.7,1.8h3v2h2v2h2v2h4c0.4,0,1-0.5,1-1v-3L19.8,16.2z M11.8,14.6c-1.1,0-2-0.9-2-2s0.9-2,2-2c1.1,0,2,0.9,2,2S12.8,14.6,11.8,14.6z"/>
      </g>
    </Icon>
  )
}

IconPassword.displayName = "IconPassword"
IconPassword.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconPassword
