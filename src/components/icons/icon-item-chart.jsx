import React from 'react'
import Icon from '../icon.jsx'

const IconItemChart = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M26,23c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S26,21.3,26,23z M13,20c-1.7,0-3,1.3-3,3c0,1.7,1.3,3,3,3
          s3-1.3,3-3C16,21.3,14.7,20,13,20z M23,10c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S24.7,10,23,10z M13,10c-1.7,0-3,1.3-3,3s1.3,3,3,3
          s3-1.3,3-3S14.7,10,13,10z"/>
      </g>
    </Icon>
  )
}

IconItemChart.displayName = "IconItemChart"
IconItemChart.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconItemChart
