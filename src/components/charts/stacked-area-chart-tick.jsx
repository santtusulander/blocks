import React, { PropTypes } from 'react'
import { formatBitsPerSecond } from '../../util/helpers'
import { Text } from 'recharts'

const StackAreaCustomTick = ({ payload = {}, valueFormatter = formatBitsPerSecond, x, y }) => {

  return (
    <Text x={x - 20} y={y} textAnchor="end">
      {valueFormatter(payload.value, true)}
    </Text>
  )
}

StackAreaCustomTick.displayName = "LineChartTooltip"
StackAreaCustomTick.propTypes = {
  payload: PropTypes.object,
  valueFormatter: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number
}

export default StackAreaCustomTick
