import React from 'react'
import Icon from '../icon.jsx'

const IconInfo = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle className="base" cx="18" cy="18" r="12"/>
        <path className="primary pale-blue" d="M20,14h-4v-3h4V14z M20,25h-4v-9h4V25z"/>
      </g>
    </Icon>
  )
}

IconInfo.displayName = "IconInfo"
IconInfo.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconInfo
