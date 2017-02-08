import React, { PropTypes } from 'react'

const CustomXAxisTick = ({x, y, payload, secondaryXAxisTick}) =>
  <g transform={`translate(${x},${y})`}>
    <text x="0" y="0"  textAnchor="middle" >
      <tspan x={0} dy={16}>{payload.value}</tspan>
      <tspan x={0} dy={16}>
      {payload.index === 0 ?
         secondaryXAxisTick[payload.index] :
         secondaryXAxisTick[payload.index -1] !== secondaryXAxisTick[payload.index] &&
         secondaryXAxisTick[payload.index]
       }
      </tspan>
    </text>
  </g>

CustomXAxisTick.displayName = "CustomXAxisTick"
CustomXAxisTick.propTypes = {
  payload: PropTypes.object,
  secondaryXAxisTick: PropTypes.arrayOf(PropTypes.string).isRequired,
  x: PropTypes.number,
  y: PropTypes.number
}

export default CustomXAxisTick
