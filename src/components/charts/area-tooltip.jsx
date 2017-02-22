import React, { PropTypes } from 'react'

import { formatBitsPerSecond, formatUnixTimestamp} from '../../util/helpers'

import './area-tooltip.scss'

/* eslint-disable react/no-multi-comp  */
const AreaTooltip = ({ payload = [], iconClass, valueFormatter = formatBitsPerSecond }) => {
  const currentPayload = payload.filter( ({dataKey}) => !dataKey.includes('comparison_'))
  const comparisonPayload = payload.filter( ({dataKey}) => dataKey.includes('comparison_'))

  const normalPayload = comparisonPayload.length === 1 ? [...comparisonPayload, ...currentPayload] : currentPayload;   // combine payload if they're 1:1 comparison
  return (
    <div className="area-chart-tooltip">
      <div className="normal-data">
        <TooltipDataset
          iconClass={iconClass}
          payload={normalPayload}
          valueFormatter={valueFormatter}
          hideTotal={comparisonPayload.length === 1}
        />
      </div>

      {
        comparisonPayload.length > 1 && <div className='comparison-data'>
          <TooltipDataset
            iconClass={iconClass}
            payload={comparisonPayload}
            valueFormatter={valueFormatter}
            />
        </div>
      }
    </div>
  )
}

AreaTooltip.displayName = 'AreaTooltip'

AreaTooltip.propTypes = {
  iconClass: PropTypes.func,
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default AreaTooltip

const TooltipDataset = ({payload, valueFormatter, iconClass, hideTotal}) => {
  const total = valueFormatter(payload.reduce((sum, { value }) => sum += value, 0), true)
  const ts = payload && payload[0] && payload[0].payload && payload[0].payload.timestamp
  return (
    <div>
      <div className="tooltip-item">
        <span className="legend-label">
          <span className="legend-line">
            {formatUnixTimestamp( ts, "MMM D H:mm A") }
          </span>
        </span>
      </div>

      <div className="tooltip-metric-item">
        {payload.map(({ name, value, dataKey }, i) =>
          <div key={i} className="tooltip-item">
            <span className="legend-label">
              <span className={`legend-icon ${dataKey} ${iconClass}`}>&mdash; </span>
              {name}
            </span>
            <span className='legend-value'>{valueFormatter(value, true)}</span>
          </div>
        ).reverse()}
      </div>

      {(payload.length > 1 && !hideTotal) &&    // check if there should be a total display if there is only one item or it's 1:1 comparison
        <div>
          <hr style={{ margin: '8px -20px' }}/>
          <div className="tooltip-item">
            <span className="legend-label">
              <span className="legend-line">
                Total
              </span>
            </span>
            <span id="tooltip-total" className="legend-value">{total}</span>
          </div>
        </div>
      }
    </div>
  )
}

TooltipDataset.displayName = 'TooltipDataset'
TooltipDataset.propTypes = {
  hideTotal: PropTypes.bool,
  iconClass: PropTypes.func,
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}
