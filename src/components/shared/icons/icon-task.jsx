import React from 'react'
import Icon from '../icon.jsx'

const IconTask = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle className="base" cx="18" cy="18" r="12"/>
        <polygon className="primary" points="17.4,24.2 11.4,19.2 13.1,17.2 16.8,20.2 22.4,11.8 24.6,13.3"/>
      </g>
    </Icon>
  )
}

IconTask.displayName = "IconTask"
IconTask.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconTask
