import React, { PropTypes } from 'react'

import { formatBytes } from '../../util/helpers'

const CustomTooltip = ({ payload = [], iconClass }) => {
  const dataForTooltip = payload.map(({ name, value, dataKey }) => ({
    name,
    value: formatBytes(value),
    className: iconClass(dataKey)
  }))
  const total = formatBytes(payload.reduce((sum, { value }) => sum += value, 0))
  return (
    <div className="rechart-tooltip">
      {dataForTooltip.map(({ name, value, className }, i) =>
        <div key={i} className="tooltip-item">
          <span className="legend-label">
            <span className={`legend-icon ${className}`}>&mdash; </span>
            {name}
          </span>
          <span id='legend-value' className='legend-value'>{value}</span>
        </div>
      )}
      <hr style={{ margin: '7px 0' }}
      />
      <div className="tooltip-item">
        <span className="legend-label">
          Total
        </span>
        <span className='legend-value'>{total}</span>
      </div>
    </div>
  )
}

CustomTooltip.propTypes = {
  iconClass: PropTypes.func,
  payload: PropTypes.array
}

export default CustomTooltip
