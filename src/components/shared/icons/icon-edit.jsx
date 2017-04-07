import React from 'react'
import Icon from '../icon.jsx'

const IconEdit = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M19.5,13.3l3.2,3.2L13.2,26H10v-3.2L19.5,13.3z M25.8,13.4l-0.7,0.7l-1.2,1.2l-3.2-3.2 l1.2-1.2l0.7-0.7c0.3-0.3,0.7-0.3,1,0l2.3,2.3C26.1,12.7,26.1,13.2,25.8,13.4z"/>
      </g>
    </Icon>
  )
}

IconEdit.displayName = "IconEdit"
IconEdit.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconEdit
