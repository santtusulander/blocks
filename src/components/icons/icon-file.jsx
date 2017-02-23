import React from 'react'
import Icon from '../icon.jsx'

const IconFile = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M26,19H10v-2h16V19z M26,21H10v2h16V21z M26,25H10v2h16V25z M30,
                11l-8-8H6v30h24V11z M8,5h13l7,7v19H8V5z M28,11h-6V5h-2v8
                h8V11z M18,13h-8v2h8V13z"/>
      </g>
    </Icon>
  )
}

IconFile.displayName = "IconFile"
IconFile.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconFile
