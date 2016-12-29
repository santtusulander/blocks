import React from 'react'
import Icon from '../icon.jsx'

const IconAccount = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M30.2,16h-3.3c-0.2-1-0.6-2-1.2-2.8l2.3-2.3c0.4-0.4,0.4-1,0-1.4l-1.4-1.4
          c-0.4-0.4-1-0.4-1.4,0l-2.3,2.3C22,9.7,21,9.3,20,9.1V5.8c0-0.6-0.5-1-1-1h-2c-0.6,0-1,0.5-1,1v3.3c-1,0.2-2,0.6-2.8,1.2l-2.3-2.3
          c-0.4-0.4-1-0.4-1.4,0L8,9.4c-0.4,0.4-0.4,1,0,1.4l2.3,2.3C9.7,14,9.3,14.9,9.1,16H5.8c-0.6,0-1,0.5-1,1v2c0,0.6,0.5,1,1,1h3.3
          c0.2,1,0.6,2,1.2,2.8L8,25.2c-0.4,0.4-0.4,1,0,1.4l1.4,1.4c0.4,0.4,1,0.4,1.4,0l2.3-2.3c0.9,0.5,1.8,0.9,2.8,1.2v3.3
          c0,0.6,0.5,1,1,1h2c0.6,0,1-0.5,1-1v-3.3c1-0.2,2-0.6,2.8-1.2l2.3,2.3c0.4,0.4,1,0.4,1.4,0l1.4-1.4c0.4-0.4,0.4-1,0-1.4l-2.3-2.3
          c0.5-0.9,0.9-1.8,1.2-2.8h3.3c0.6,0,1-0.5,1-1v-2C31.2,16.4,30.7,16,30.2,16z M18,23.1c-2.8,0-5.1-2.3-5.1-5.1
          c0-2.8,2.3-5.1,5.1-5.1c2.8,0,5.1,2.3,5.1,5.1C23.1,20.8,20.8,23.1,18,23.1z"/>
      </g>
    </Icon>
  )
}

IconAccount.displayName = "IconAccount"
IconAccount.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconAccount
