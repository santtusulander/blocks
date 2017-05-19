import React from 'react'
import Icon from '../icon.jsx'

const IconContextMenu = (props) => {
  const {className, height, viewBox, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox={viewBox}>
      <g>
        <path d="M12.5,20 C11.6715729,20 11,19.3284271 11,18.5
        C11,17.6715729 11.6715729,17 12.5,17 C13.3284271,17
        14,17.6715729 14,18.5 C14,19.3284271 13.3284271,20
        12.5,20 Z M18.5,20 C17.6715729,20 17,19.3284271 17,18.5
        C17,17.6715729 17.6715729,17 18.5,17 C19.3284271,17 20,17.6715729
        20,18.5 C20,19.3284271 19.3284271,20 18.5,20 Z M24.5,20
        C23.6715729,20 23,19.3284271 23,18.5 C23,17.6715729
        23.6715729,17 24.5,17 C25.3284271,17 26,17.6715729 26,18.5
        C26,19.3284271 25.3284271,20 24.5,20 Z" />
      </g>
    </Icon>
  )
}

IconContextMenu.displayName = "IconContextMenu"
IconContextMenu.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  viewBox: React.PropTypes.string,
  width: React.PropTypes.number
}

export default IconContextMenu
