import React from 'react'
import Icon from '../icon.jsx'

const IconProblem = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle className="base" cx="18" cy="18" r="12"/>
        <path className="primary" d="M20,20h-4v-9h4V20z M20,25h-4v-3h4V25z"/>
      </g>
    </Icon>
  )
}

IconProblem.displayName = "IconProblem"
IconProblem.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconProblem
