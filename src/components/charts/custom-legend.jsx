import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

const CustomLegend = ({ data = [], payload, order }) => {
  if (!data.length && payload.length) {
    data = payload.map((pl) => pl.payload)
  }
  if (order) {
    data.sort((a, b) => order.indexOf(a.dataKey) - order.indexOf(b.dataKey))
  }
  return (
    <div className="bar-chart-legend">
      {data.map(({ name, className }, i) =>
        <div key={i} className="bar-chart-legend-item">
          <span className="legend-label">
            <span className={`legend-icon ${className}`}><FormattedMessage id="portal.mdashWithSpace"/></span>
            {name}
          </span>
        </div>
      )}
    </div>
  )
}

CustomLegend.displayName = "CustomLegend"
CustomLegend.propTypes = {
  data: PropTypes.array,
  order: PropTypes.array,
  payload: PropTypes.array
}

export default CustomLegend
