import React from 'react'
import Icon from '../icon.jsx'

const IconCaretDown = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if(className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 35 32">
      <g>
        <circle cx="18" cy="18" r="12" className="base"/>
        <polygon fill="#FFFFFF" points="12,15.9 18,21.9 24,15.9 " className="primary"/>
      </g>
    </Icon>
  )
}

IconCaretDown.propTypes = {
  className: React.PropTypes.string,
  count: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconCaretDown
