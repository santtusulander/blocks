import React from 'react'
import Icon from '../icon.jsx'

const IconTrash = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M15,26h-2V15h2V26z M19,15h-2v11h2V15z M23,15h-2v11h2V15z M25,13H11v15h14V13z M27,11v19H9V11H27z M22,8V6h-8 v2H9v2h18V8H22z"/>
      </g>
    </Icon>
  )
}

IconTrash.displayName = "IconTrash"
IconTrash.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconTrash
