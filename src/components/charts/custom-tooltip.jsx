import React, { PropTypes } from 'react'

import { formatBytes } from '../../util/helpers'

const CustomTooltip = ({ payload = [], iconClass }) => {
  const total = formatBytes(payload.reduce((sum, { value }) => sum += value, 0))
  return (
    <div className="rechart-tooltip">
      {payload.map(({ name, value, dataKey }, i) =>
        <div key={i} id="tooltip-item" className="tooltip-item">
          <span className="legend-label">
            <span className={`legend-icon ${iconClass(dataKey)}`}>&mdash; </span>
            {name}
          </span>
          <span id='legend-value' className='legend-value'>{formatBytes(value)}</span>
        </div>
      )}
      <hr style={{ margin: '7px 0' }}
      />
      <div className="tooltip-item">
        <span className="legend-label">
          Total
        </span>
        <span id="tooltip-total" className="legend-value">{total}</span>
      </div>
    </div>
  )
}

CustomTooltip.propTypes = {
  iconClass: PropTypes.func,
  payload: PropTypes.array
}

export default CustomTooltip
