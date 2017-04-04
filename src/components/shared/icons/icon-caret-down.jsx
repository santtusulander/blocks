import React from 'react'
import Icon from '../icon.jsx'

const IconCaretDown = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone caret-icon';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle cx="18" cy="18" r="12" className="base"/>
        <polygon points="12,15.9 18,21.9 24,15.9" className="primary"/>
      </g>
    </Icon>
  )
}

IconCaretDown.displayName = "IconCaretDown"
IconCaretDown.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconCaretDown
