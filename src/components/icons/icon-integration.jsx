import React from 'react'
import Icon from '../icon.jsx'

const IconIntegration = () => {
  return (
    <Icon width="30" height="30" className="two-tone">
      <g>
        <circle className="base" cx="15" cy="15" r="15"/>
        <rect className="primary" x="8.2" y="6.99" width="14" height="4"/>
        <rect className="primary" x="8.2" y="18.99" width="14" height="4"/>
        <rect className="primary" x="8.2" y="12.99" width="14" height="4"/>
      </g>
    </Icon>
  )
}

export default IconIntegration
