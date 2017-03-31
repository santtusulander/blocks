import React from 'react'
import Icon from '../icon.jsx'

const IconCaretRight = (props) => {
  const {className, height, width} = props
  let classNames = 'two-tone caret-icon';
  if (className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <Icon className={classNames} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <circle cx="18" cy="18" r="12" className="base"/>
        <polygon points="15.9,24 21.9,18 15.9,12" className="primary"/>
      </g>
    </Icon>
  )
}

IconCaretRight.displayName = "IconCaretRight"
IconCaretRight.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconCaretRight
