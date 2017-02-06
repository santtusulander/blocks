import React, { PropTypes } from 'react'

const CustomXAxisTick = ({x, y, payload, secondaryXAxisTick}) =>
  <g transform={`translate(${x},${y})`}>
    <text x="0" y="0"  textAnchor="end" >
      <tspan x={0} dy={16}>{payload.value}</tspan>
      <tspan x={0} dy={16}>{payload.index === 0 ?
         secondaryXAxisTick[payload.index] :
         secondaryXAxisTick[payload.index -1] !== secondaryXAxisTick[payload.index] &&
         secondaryXAxisTick[payload.index]
       }
      </tspan>
    </text>
  </g>

CustomXAxisTick.displayName = "CustomLegend"
CustomXAxisTick.propTypes = {
  payload: PropTypes.object,
  secondaryXAxisTick: PropTypes.array.isRequired,
  x: PropTypes.number,
  y: PropTypes.number
}

export default CustomXAxisTick
