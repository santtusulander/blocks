import React, { PropTypes } from 'react'

const CustomLegend = ({ data = [] }) =>
  <div className="bar-chart-legend">
    {data.map(({ name, className }, i) =>
      <div key={i} className="bar-chart-legend-item">
        <span className="legend-label">
          <span className={`legend-icon ${className}`}>&mdash; </span>
          {name}
        </span>
      </div>
    )}
  </div>

CustomLegend.propTypes = {
  data: PropTypes.array
}

export default CustomLegend
