import React from 'react'

const CustomLegend = ({ data = [] }) =>
  <div className="rechart-legend">
    {data.map(({ name, className }, i) =>
      <div key={i} className="legend-item">
        <span className="legend-label">
          <span className={`legend-icon ${className}`}>&mdash; </span>
          {name}
        </span>
      </div>
    )}
  </div>

export default CustomLegend
