import React from 'react'
import Icon from '../icon.jsx'

const IconExport = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M17,10.3V20h2v-9.7l2.3,2.6l1.3-1L18,6.6l-4.7,5.3l1.3,1L17,10.3z M10,17L10,17c0-1.1,0.9-2,2-2h0h3v2h-3v9h12v-9h-3v-2h3
          h0c1.1,0,2,0.9,2,2v9l0,0c0,1.1-0.9,2-2,2h0H12l0,0c-1.1,0-2-0.9-2-2V17z"/>
      </g>
    </Icon>
  )
}

IconExport.displayName = "IconExport"
IconExport.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconExport
