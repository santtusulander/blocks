import React from 'react'
import Icon from '../icon.jsx'

const IconFolder = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 512 512">
      <g>
        <path d="M390.5,144c0,0-154.7,0-167,0c-4.7,0-10.7-9.9-18.5-19c-7.1-8.3-14.7-13-20.5-13c-7.5,0-60.3,0-60.3,0  c-15.5,0-28.2,8.9-28.2,24.3v234.6c0,15.5,12.7,29.1,28.2,29.1h266.3c15.5,0,25.5-13.6,25.5-29.1V168.8C416,153.3,406,144,390.5,144  z M124.2,128H168c0,0,7.4,0,11.3,0c3.9,0,8.6,1.6,14.3,8.3c12.1,14.3,15.5,23.7,29.9,23.7h167c6.6,0,9.5,2.2,9.5,8.8V192H112v-55.7  C112,127.3,122.3,128,124.2,128z M390.5,384H124.2c-6.5,0-12.2-6.2-12.2-13.1V208h288v162.9C400,376.9,397.4,384,390.5,384z" />
      </g>
    </Icon>
  )
}

IconFolder.displayName = "IconFolder"
IconFolder.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconFolder
