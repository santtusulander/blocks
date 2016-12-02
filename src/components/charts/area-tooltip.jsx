import React, { PropTypes } from 'react'

import { formatBitsPerSecond, formatUnixTimestamp} from '../../util/helpers'

const AreaTooltip = ({ payload = [], iconClass, valueFormatter = formatBitsPerSecond }) => {
  const currentPayload = payload.filter( ({dataKey}) => !dataKey.includes('comparison_'))
  const comparisonPayload = payload.filter( ({dataKey}) => dataKey.includes('comparison_'))

  const total = valueFormatter(currentPayload.reduce((sum, { value }) => sum += value, 0), true)
  const comparisonTotal = valueFormatter(comparisonPayload.reduce((sum, { value }) => sum += value, 0), true)

  //TODO: destruct
  const ts = currentPayload && currentPayload[0] && currentPayload[0].payload && currentPayload[0].payload.timestamp
  const compareTs = comparisonPayload && comparisonPayload[0] && comparisonPayload[0].payload && comparisonPayload[0].payload.timestamp - comparisonPayload[0].payload.timeOffset

  return (
    <div className="bar-chart-tooltip">
      Date: {formatUnixTimestamp( ts, "DD.MM.YYYY")}

      {currentPayload.map(({ name, value, dataKey }, i) =>
        <div key={i} className="tooltip-item">
          <span className="legend-label">
            <span className={`legend-icon ${iconClass(dataKey)}`}>&mdash; </span>
            {name}
          </span>
          <span className='legend-value'>{valueFormatter(value, true)}</span>
        </div>
      ).reverse()}

      <hr style={{ margin: '7px 0' }}/>

      <div className="tooltip-item">
        <span className="legend-label">
          Total
        </span>
        <span id="tooltip-total" className="legend-value">{total}</span>
      </div>

      <hr style={{ margin: '7px 0' }}/>

      Date: {formatUnixTimestamp( compareTs, "DD.MM.YYYY")}

      {comparisonPayload.map(({ name, value, dataKey }, i) =>
        <div key={i} className="tooltip-item">
          <span className="legend-label">
            <span className={`legend-icon ${iconClass(dataKey)}`}>&mdash; </span>
            {name}
          </span>
          <span className='legend-value'>{valueFormatter(value, true)}</span>
        </div>
      ).reverse()}
      <hr style={{ margin: '7px 0' }}/>

      <div className="tooltip-item">
        <span className="legend-label">
          Total
        </span>
        <span id="tooltip-total" className="legend-value">{comparisonTotal}</span>
      </div>
    </div>
  )
}

AreaTooltip.propTypes = {
  iconClass: PropTypes.func,
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default AreaTooltip
