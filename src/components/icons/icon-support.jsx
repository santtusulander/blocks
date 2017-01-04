import React from 'react'
import Icon from '../icon.jsx'

const IconSupport = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M27.3,8.7c-5.2-5.2-13.5-5.2-18.7,0c-5.2,5.2-5.2,13.5,0,18.7c5.2,5.2,13.5,5.2,18.7,0
          C32.5,22.2,32.5,13.8,27.3,8.7z M26.6,26.6c-0.5,0.5-1.1,1-1.7,1.4l-3.6-3.6c0.6-0.3,1.2-0.8,1.8-1.3c0.5-0.5,1-1.1,1.3-1.8
          l3.6,3.6C27.5,25.5,27.1,26,26.6,26.6z M9.4,9.4c0.5-0.5,1.1-1,1.7-1.4l3.6,3.6c-0.6,0.3-1.2,0.8-1.8,1.3c-0.5,0.5-1,1.1-1.3,1.8
          l-3.6-3.6C8.5,10.5,8.9,10,9.4,9.4z M13.7,13.7c2.4-2.4,6.2-2.4,8.6,0c2.4,2.4,2.4,6.2,0,8.6c-2.4,2.4-6.2,2.4-8.6,0
          C11.4,19.9,11.4,16.1,13.7,13.7z M27.9,11.1l-3.6,3.6c-0.3-0.6-0.8-1.2-1.3-1.8c-0.5-0.5-1.1-1-1.8-1.3l3.6-3.6
          c0.6,0.4,1.1,0.9,1.7,1.4C27.1,10,27.5,10.5,27.9,11.1z M8.1,24.9l3.6-3.6c0.3,0.6,0.8,1.2,1.3,1.8c0.5,0.5,1.1,1,1.8,1.3l-3.6,3.6
          c-0.6-0.4-1.1-0.9-1.7-1.4C8.9,26,8.5,25.5,8.1,24.9z"/>
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
