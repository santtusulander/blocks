import React from 'react'
import Icon from '../icon.jsx'

const IconUser = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M18,4c7.7,0,14,6.3,14,14s-6.3,14-14,14S4,25.7,4,18S10.3,4,18,4 M18,3C9.7,3,3,9.7,3,18s6.7,15,15,15s15-6.7,15-15
          S26.3,3,18,3L18,3z M18,11.2c-2,0-3.7,1.6-3.7,3.7s1.6,3.7,3.7,3.7s3.7-1.6,3.7-3.7S20,11.2,18,11.2z M18,29.5
          c3.3,0,6.2-1.4,8.3-3.5c0,0-2.6-5.8-8.3-5.8s-8.3,5.8-8.3,5.8C11.8,28.1,14.8,29.5,18,29.5z"/>
      </g>
    </Icon>
  )
}

IconUser.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconUser
