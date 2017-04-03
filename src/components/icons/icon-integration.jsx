import React from 'react'
import Icon from '../icon.jsx'

const IconIntegration = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle className="base" cx="18" cy="18" r="12"/>
        <path className="primary" d="M12,13h12v2H12V13z M12,21h12v2H12V21z M12,17h12v2H12V17z"/>
      </g>
    </Icon>
  )
}

IconIntegration.displayName = "IconIntegration"
IconIntegration.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconIntegration
