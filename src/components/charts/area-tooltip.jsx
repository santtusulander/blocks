import React, { PropTypes } from 'react'

import { formatBitsPerSecond, formatUnixTimestamp} from '../../util/helpers'

import './area-tooltip.scss'

/* eslint-disable react/no-multi-comp  */
const AreaTooltip = ({ payload = [], iconClass, valueFormatter = formatBitsPerSecond }) => {
  const currentPayload = payload.filter( ({dataKey}) => !dataKey.includes('comparison_'))
  const comparisonPayload = payload.filter( ({dataKey}) => dataKey.includes('comparison_'))

  return (
    <div className="area-chart-tooltip">

      <TooltipDataset
        iconClass={iconClass}
        payload={currentPayload}
        valueFormatter={valueFormatter}
      />

      {
        comparisonPayload.length > 0 && <div className='comparison-data'>
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

const TooltipDataset = ({payload, valueFormatter, iconClass}) => {
  const total = valueFormatter(payload.reduce((sum, { value }) => sum += value, 0), true)
  const ts = payload && payload[0] && payload[0].payload && payload[0].payload.actualTime

  return (
    <div>
      Date: {formatUnixTimestamp( ts, "MM/DD/YYYY, HH:mm") }

      {payload.map(({ name, value, dataKey }, i) =>
        <div key={i} className="tooltip-item">
          <span className="legend-label">
            <span className={`legend-icon ${dataKey} ${iconClass}`}>&mdash; </span>
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
    </div>
  )
}

TooltipDataset.displayName = 'TooltipDataset'
TooltipDataset.propTypes = {
  iconClass: PropTypes.func,
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}
