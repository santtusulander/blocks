import React from 'react'
import Icon from '../icon.jsx'

const IconDelete = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <rect x="8" y="17" width="20" height="2"/>
      </g>
    </Icon>
  )
}

IconDelete.displayName = "IconDelete"
IconDelete.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconDelete
