import React, { PropTypes } from 'react'
import { formatUnixTimestamp, formatBytes} from '../../util/helpers'
import './line-chart-tooltip.scss';

const LineChartTooltip = ({ payload = [], valueFormatter = formatBytes }) => {

  const timestamp = payload && payload[0] && payload[0].payload && payload[0].payload.timestamp;
  return (
    <div className="line-chart-tooltip">
      {payload.map(({ name, value, dataKey, payload }, i) =>
        <div key={i} className="tooltip-item">
          <span className="legend-label">
            {formatUnixTimestamp(timestamp, "MMM DD HH:mm") } { valueFormatter(value, true) }
          </span>
        </div>
      )}
    </div>
  )
}

LineChartTooltip.displayName = "LineChartTooltip"
LineChartTooltip.propTypes = {
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default LineChartTooltip
