import React from 'react'
import Icon from '../icon.jsx'

const IconServices = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M26.6,26.8H9.4c-3.1,0-5.6-2.5-5.6-5.6c0-2.6,1.8-4.8,4.2-5.4c0.9-2.8,3.8-4.6,6.9-3.9c1.5-1.7,3.7-2.7,6-2.7
          c4.1,0,7.5,3,8,7c2,0.9,3.2,2.9,3.2,5C32.2,24.3,29.7,26.8,26.6,26.8z M13.7,13.8c-1.9,0-3.5,1.3-3.9,3.2l-0.1,0.7l-0.7,0.1
          c-1.8,0.2-3.1,1.7-3.1,3.5c0,2,1.6,3.6,3.6,3.6h17.3c2,0,3.6-1.6,3.6-3.6c0-1.5-1-2.9-2.5-3.4l-0.7-0.2l0-0.7
          c-0.2-3.2-2.8-5.8-6.1-5.8c-1.9,0-3.7,0.9-4.9,2.5l-0.4,0.6L15,14C14.5,13.9,14.1,13.8,13.7,13.8z"/>
      </g>
    </Icon>
  )
}

IconServices.displayName = "IconServices"
IconServices.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconServices
