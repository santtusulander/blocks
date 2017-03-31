import React from 'react'
import Icon from '../icon.jsx'

const IconQuestion = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle className="base" cx="18" cy="18" r="12"/>
        <path className="primary" d="M16.1,20.8c0-0.7,0.1-1.3,0.4-1.9c0.5-0.6,1-1.1,1.6-1.4c0.4-0.2,0.7-0.6,0.9-0.9c0.2-0.4,0.4-0.8,0.3-1.3
          c0-0.4-0.1-0.9-0.4-1.2c-0.3-0.3-0.7-0.5-1.2-0.4c-0.4,0-0.7,0.1-1,0.4c-0.3,0.3-0.4,0.7-0.4,1.1h-2.9V15
          c-0.1-1.1,0.4-2.1,1.2-2.8c0.9-0.7,2.1-1,3.2-0.9c1.2-0.1,2.4,0.3,3.4,1.1c0.8,0.7,1.3,1.8,1.2,2.9c0,0.7-0.2,1.5-0.7,2.1
          c-0.4,0.6-1,1.1-1.7,1.5c-0.3,0.2-0.6,0.5-0.8,0.8c-0.1,0.4-0.2,0.8-0.2,1.2L16.1,20.8L16.1,20.8z M19.1,24.5h-3v-2.4h3V24.5z"/>
      </g>
    </Icon>
  )
}

IconQuestion.displayName = "IconQuestion"
IconQuestion.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconQuestion
