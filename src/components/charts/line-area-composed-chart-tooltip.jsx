import React, { PropTypes } from 'react'
import { formatUnixTimestamp, formatBytes} from '../../util/helpers'
import classNames from 'classnames'

import './line-area-composed-chart-tooltip.scss'

const LineAreaComposedChartTooltip = ({ payload = [], valueFormatter = formatBytes, iconClassNamePicker, ignoreValues=[] }) => {
  const timestamp = payload[0] && payload[0].payload && payload[0].payload.timestamp
  const comparisonTimestamp = payload[0] && payload[0].payload && payload[0].payload.historical_timestamp

  return (
    <div className="line-area-composed-chart-tooltip">
      {payload.map(({ name, value, dataKey, payload }, i) =>
        !ignoreValues.includes(dataKey) && <div key={i} className="tooltip-item">
          <div className="tooltip-item-date">
            {i === 0
              ? formatUnixTimestamp( timestamp, "MMM DD HH:mm")
              : formatUnixTimestamp( comparisonTimestamp, "MMM DD HH:mm") }
          </div>
          <div className="legend">
            <span className="legend-label">
              <span className={classNames("legend-icon", iconClassNamePicker(dataKey))}>&mdash; </span>
              {name}
            </span>
            <span className="legend-value">
              { valueFormatter(value, true) }
            </span>
          </div>
        </div>
      ).reverse()}
    </div>
  )
}

LineAreaComposedChartTooltip.displayName = "LineChartTooltip"
LineAreaComposedChartTooltip.propTypes = {
  iconClassNamePicker: PropTypes.func,
  ignoreValues: PropTypes.arrayOf(PropTypes.string),
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default LineAreaComposedChartTooltip
