import React from 'react'
import Icon from '../icon.jsx'

const IconServices = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="26,21 26,17 19,17 19,15 24,15 24,7 12,7 12,15 17,15 17,17 10,17 10,21 5,21 5,29
          17,29 17,21 12,21 12,19 24,19 24,21 19,21 19,29 31,29 31,21"/>
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
