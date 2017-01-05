import React from 'react'
import Icon from '../icon.jsx'

const IconCalendar = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M13,9h1v2h-1V9z M24,10v2h-3v-2h-6v2h-3v-2H9v4h18v-4H24z M22,9v0.9V11h1V9.9V9H22z M27,15v12H9V15H27z M13,23h-2v2h2V23z
          M13,20h-2v2h2V20z M13,17h-2v2h2V17z M17,23h-2v2h2V23z M17,20h-2v2h2V20z M17,17h-2v2h2V17z M21,23h-2v2h2V23z M21,20h-2v2h2V20z
          M21,17h-2v2h2V17z M25,23h-2v2h2V23z M25,20h-2v2h2V20z M25,17h-2v2h2V17z"/>
      </g>
    </Icon>
  )
}

IconCalendar.displayName = "IconCalendar"
IconCalendar.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconCalendar
