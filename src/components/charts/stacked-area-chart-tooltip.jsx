import React, { PropTypes } from 'react'

import { formatBytes } from '../../util/helpers'

const CustomTooltip = ({ payload = [], iconClass, valueFormatter = formatBytes }) => {
  const total = valueFormatter(payload.reduce((sum, { value }) => sum += value, 0))
  return (
    <div className="bar-chart-tooltip">
      {payload.map(({ name, value, dataKey }, i) =>
        <div key={i} className="tooltip-item">
          <span className="legend-label">
            <span className={`legend-icon ${iconClass(dataKey)}`}>&mdash; </span>
            {name}
          </span>
          <span className='legend-value'>{valueFormatter(value)}</span>
        </div>
      )}
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

CustomTooltip.displayName = "CustomTooltip"
CustomTooltip.propTypes = {
  iconClass: PropTypes.func,
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default CustomTooltip
