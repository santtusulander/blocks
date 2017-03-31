import React from 'react'
import Icon from '../icon.jsx'

const IconIncident = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle className="base" cx="18" cy="18" r="12"/>
        <polygon className="primary" points="15.5,10.4 15.2,14.1 11.5,13.3 13.4,16.5 10,18 13.4,19.5 11.5,22.7 15.2,21.9 15.5,25.6 18,22.8
          20.5,25.6 20.8,21.9 24.5,22.7 22.6,19.5 26,18 22.6,16.5 24.5,13.3 20.8,14.1 20.5,10.4 18,13.2"/>
      </g>
    </Icon>
  )
}

IconIncident.displayName = "IconIncident"
IconIncident.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconIncident
