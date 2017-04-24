import React from 'react'
import Icon from '../icon.jsx'

const IconServerError = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path className="base" d="M18,28c-4.8,0-8.2-1.4-8.2-2.6v-3.5c1.5,1.3,4.9,1.9,8.2,1.9c0.6,0,1.2,0,1.9-0.1c0-0.1,0-0.2,0-0.4c0-0.1,0-0.3,0-0.4
          c-0.6,0-1.2,0.1-1.9,0.1c-4.8,0-8.2-1.4-8.2-2.6V17c1.5,1.3,4.9,1.9,8.2,1.9c3.3,0,6.7-0.7,8.2-1.9v1.3c0.3,0.1,0.5,0.1,0.8,0.2
          v-7.9c0-2.2-4.6-3.4-9-3.4c-4.4,0-9,1.2-9,3.4v14.9c0,2.2,4.6,3.4,9,3.4c1.7,0,3.5-0.2,5-0.6c-0.4-0.2-0.7-0.4-1-0.6
          C20.9,27.9,19.5,28,18,28z M18,8c4.8,0,8.2,1.4,8.2,2.6c0,1.2-3.4,2.6-8.2,2.6c-4.8,0-8.2-1.4-8.2-2.6C9.8,9.3,13.2,8,18,8z
          M9.8,12c1.5,1.3,4.9,1.9,8.2,1.9c3.3,0,6.7-0.7,8.2-1.9v3.5c0,1.2-3.4,2.6-8.2,2.6c-4.8,0-8.2-1.4-8.2-2.6V12z"/>
        <circle className="base secondary" cx="25.2" cy="23.4" r="4.7"/>
        <polygon className="primary" points="27.2,22.1 26.6,21.5 25.2,22.9 23.8,21.5 23.2,22.1 24.6,23.5 23.2,24.9 23.8,25.5 25.2,24.1
          26.6,25.5 27.2,24.9 25.8,23.5"/>
      </g>
    </Icon>
  )
}

IconServerError.displayName = "IconServerError"
IconServerError.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconServerError
