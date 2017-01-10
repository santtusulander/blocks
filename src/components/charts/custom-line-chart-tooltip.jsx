import React, { PropTypes } from 'react'
import { formatUnixTimestamp} from '../../util/helpers'


const CustomLineChartTooltip = ({ payload = [] }) => {
  return (
    <div className="line-chart-tooltip">
      {payload.map(({ name, value, dataKey, payload }, i) =>
        <div key={i} className="tooltip-item">
          <span className="legend-label">
            {formatUnixTimestamp( payload.timestamp, "MMM DD HH:mm") }
          </span>
        </div>
      )}
    </div>
  )
}

CustomLineChartTooltip.displayName = "CustomLineChartTooltip"
CustomLineChartTooltip.propTypes = {
  payload: PropTypes.array
}

export default CustomLineChartTooltip
