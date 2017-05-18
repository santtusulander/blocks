import React from 'react'
import Icon from '../icon.jsx'

const IconBack = (props) => {
  const {className, height, viewBox, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox={viewBox}>
      <g>
        <path d="M9.5367,0.2273 L0.2277,7.5403 C-0.0753,7.8423 -0.0753,8.3373 0.2277,8.6403
        L9.5367,15.9183 C9.6857,16.0693 9.8847,16.1473 10.0857,16.1473
        C10.1877,16.1473 10.2877,16.1263 10.3847,16.0883
        C10.6757,15.9673 10.8487,15.6843 10.8487,15.3703 L10.8487,11.0103
        C20.8047,11.0103 25.1567,13.8183 24.4957,22.7613 C28.7127,8.4543 20.6187,5.2193 10.8487,5.2193
        L10.8487,0.7773 C10.8487,0.4623 10.6757,0.1793 10.3847,0.0593
        C10.0957,-0.0617 9.7587,0.0063 9.5367,0.2273 Z" />
      </g>
    </Icon>
  )
}

IconBack.displayName = "IconBack"
IconBack.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  viewBox: React.PropTypes.string,
  width: React.PropTypes.number
}

export default IconBack
