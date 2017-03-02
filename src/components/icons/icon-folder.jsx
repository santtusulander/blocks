import React from 'react'
import Icon from '../icon.jsx'

const IconFolder = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M28.5,9H15.9l-1.3-1.4C14.2,7.2,13.6,7,13.1,7H7.5c-1.7,0-3,1.3-3,3v6v3v6.9c0,1.7,1.3,3,3,3h21c1.7,0,3-1.3,3-3V19v-3v-4
          C31.5,10.3,30.2,9,28.5,9z M7.5,9h5.6l1.3,1.4c0.4,0.4,0.9,0.6,1.4,0.6h12.6c0.6,0,1,0.4,1,1v1.1c-0.3-0.1-0.6-0.2-1-0.2h-21
          c-0.4,0-0.7,0.1-1,0.2V10C6.5,9.4,6.9,9,7.5,9z M29.5,25.9c0,0.6-0.4,1-1,1h-21c-0.6,0-1-0.4-1-1V19v-3c0-0.6,0.4-1,1-1h21
          c0.6,0,1,0.4,1,1v3V25.9z"/>
      </g>
    </Icon>
  )
}

IconFolder.displayName = "IconFolder"
IconFolder.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconFolder
