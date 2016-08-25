import React from 'react'
import Icon from '../icon.jsx'

const IconEye = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if(className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path className="base" d="M7.1,19c-0.3-0.5-0.3-1.4,0-2c0,0,3.8-6.2,10.7-6.3c7-0.1,11.1,6.3,11.1,6.3c0.3,0.5,0.3,1.4,0,2 c0,0-3.8,6.2-10.7,6.3C11.1,25.4,7.1,19,7.1,19z"/>
        <path className="primary" d="M18,23.1c-2.8,0-5.1-2.3-5.1-5.1s2.3-5.1,5.1-5.1s5.1,2.3,5.1,5.1S20.8,23.1,18,23.1z M18,14.5 c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5S19.9,14.5,18,14.5z"/>
      </g>
    </Icon>
  )
}

IconEye.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconEye
