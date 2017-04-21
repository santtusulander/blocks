import React from 'react'
import Icon from '../icon.jsx'

const IconQuestionMark = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M15.8,20.9c0-0.9,0.2-1.5,0.4-2c0.2-0.5,0.7-1,1.4-1.6c0.5-0.4,0.8-0.8,1.1-1.2s0.4-0.9,0.4-1.5
          c0-0.6-0.2-1.1-0.5-1.4s-0.8-0.5-1.4-0.5c-0.5,0-0.9,0.1-1.2,0.5c-0.3,0.3-0.5,0.7-0.5,1.7h-2.8c0-1.5,0.4-2.6,1.2-3.3
          s1.9-1.1,3.3-1.1c1.5,0,2.6,0.3,3.4,1.1s1.2,1.7,1.2,3c0,0.8-0.2,1.6-0.7,2.3c-0.6,0.9-1.4,1.3-2,2c-0.6,0.6-0.5,1.3-0.5,2H15.8z
          M18.8,25.9h-3v-3h3V25.9z"/>
      </g>
    </Icon>
  )
}

IconQuestionMark.displayName = "IconQuestionMark"
IconQuestionMark.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconQuestionMark
