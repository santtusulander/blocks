import React from 'react'
import Icon from '../icon.jsx'

const IconChart = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <path d="M13,17v8h-3v-8H13z M16,11v14h3V11H16z M22,14v11h3V14H22z"/>
      </g>
    </Icon>
  )
}

IconChart.displayName = "IconChart"
IconChart.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconChart
