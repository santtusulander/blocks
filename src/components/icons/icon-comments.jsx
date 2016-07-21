import React from 'react'
import Icon from '../icon.jsx'

const IconComments = (props) => {
  return (
    <Icon width="35" height="32" className="two-tone">
      <polygon points="35 0 0 0 0 23 7 23 7 32 16 23 35 23 35 0" className="base"/>
      <text x="17" y="17" textAnchor="middle" className="primary">{props.count}</text>
    </Icon>
  )
}

IconComments.displayName = 'IconComments'
IconComments.propTypes = {
  count: React.PropTypes.string
}

export default IconComments
