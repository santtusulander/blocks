import React from 'react'
import Icon from '../icon.jsx'

const IconServerValidation = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path className="base" d="M18,7.2c-4.4,0-9,1.2-9,3.4v14.9c0,2.2,4.6,3.4,9,3.4c1.7,0,3.5-0.2,5-0.6c-0.4-0.2-0.7-0.4-1-0.6c-1.2,0.2-2.5,0.4-4,0.4
          c-4.8,0-8.2-1.4-8.2-2.6v-3.5c1.5,1.3,4.9,1.9,8.2,1.9c0.6,0,1.2,0,1.9-0.1c0-0.1,0-0.2,0-0.4c0-0.1,0-0.3,0-0.4
          c-0.6,0-1.2,0.1-1.9,0.1c-4.8,0-8.2-1.4-8.2-2.6V17c1.5,1.3,4.9,1.9,8.2,1.9c3.3,0,6.7-0.7,8.2-1.9v1.3c0.3,0.1,0.5,0.1,0.8,0.2
          v-7.9C27,8.4,22.4,7.2,18,7.2z M26.2,15.5c0,1.2-3.4,2.6-8.2,2.6c-4.8,0-8.2-1.4-8.2-2.6V12c1.5,1.3,4.9,1.9,8.2,1.9
          c3.3,0,6.7-0.7,8.2-1.9V15.5z M18,13.2c-4.8,0-8.2-1.4-8.2-2.6C9.8,9.3,13.2,8,18,8c4.8,0,8.2,1.4,8.2,2.6
          C26.2,11.8,22.9,13.2,18,13.2z"/>
        <path className="base secondary" d="M25.2,28.1c-2.6,0-4.7-2.1-4.7-4.7c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7C29.8,26,27.7,28.1,25.2,28.1z"/>
        <polygon className="primary" points="24.4,25.4 22.7,23.8 23.3,23.2 24.4,24.3 27.1,21.9 27.6,22.4"/>
      </g>
    </Icon>
  )
}

IconServerValidation.displayName = "IconServerValidation"
IconServerValidation.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconServerValidation
