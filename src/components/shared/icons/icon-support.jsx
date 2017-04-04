import React from 'react'
import Icon from '../icon.jsx'

const IconSupport = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M27.5,13.1c-1-4.4-4.9-7.7-9.5-7.7c-4.7,0-8.6,3.3-9.6,7.7c-1.2,0.7-1.9,1.9-1.9,3.4v4.6c0,1.6,1,3,2.4,3.6
          c0.5,2,2.1,4.8,5.9,4.8h1.1c0.3,0.6,1,1,1.7,1h1.6c1.1,0,2-0.9,2-2s-0.9-2-2-2h-1.6c-0.7,0-1.4,0.4-1.7,1h-1.1
          c-2.3,0-3.3-1.5-3.7-2.6c0.7-0.3,1.3-1,1.3-1.8v-8.6c0-1-0.7-1.8-1.7-1.9c1.1-3,3.9-5.2,7.3-5.2c3.4,0,6.2,2.2,7.3,5.2
          c-0.9,0.1-1.7,0.9-1.7,1.9v8.6c0,1,0.7,1.8,1.6,1.9c0.9,0.1,1.8-0.3,1.8-0.3c1.5-0.6,2.5-2,2.5-3.6v-4.6
          C29.5,15.1,28.7,13.8,27.5,13.1z"/>
      </g>
    </Icon>
  )
}

IconSupport.displayName = "IconSupport"
IconSupport.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSupport
