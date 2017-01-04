import React from 'react'

const Icon = (props) => {
  const {children, className, height, viewbox, width} = props
  let classNames = 'icon';
  if(className) {
    classNames = classNames + ' ' + className;
  }
  return (
    <svg className={classNames}
      viewBox={viewbox || '0 0 36 36'}
      width={width || 36}
      height={height || 36}>
      {children}
    </svg>
  )
}

Icon.displayName = "Icon"
Icon.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  viewbox: React.PropTypes.string,
  width: React.PropTypes.number
}

export default Icon
