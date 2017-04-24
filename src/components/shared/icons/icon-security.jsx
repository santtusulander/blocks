import React from 'react'
import Icon from '../icon.jsx'

const IconSecurity = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M25.3,16.1v-3.7c0-4.1-3.3-7.3-7.3-7.3s-7.3,3.3-7.3,7.3v3.7H7v14.7h22V16.1H25.3z M18.9,24.2v2.9H17v-2.9
          c-1.1-0.4-1.8-1.4-1.8-2.6c0-1.5,1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8C20.7,22.8,19.9,23.8,18.9,24.2z M21.6,16.1h-7.3v-3.7
          c0-2,1.6-3.7,3.7-3.7c2,0,3.7,1.6,3.7,3.7V16.1z"/>
      </g>
    </Icon>
  )
}

IconSecurity.displayName = "IconSecurity"
IconSecurity.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSecurity
