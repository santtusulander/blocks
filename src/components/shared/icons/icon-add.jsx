import React from 'react'
import Icon from '../icon.jsx'

const IconAdd = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <polygon points="28,17 19,17 19,8 17,8 17,17 8,17 8,19 17,19 17,28 19,28 19,19 28,19"/>
      </g>
    </Icon>
  )
}

IconAdd.displayName = "IconAdd"
IconAdd.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconAdd
