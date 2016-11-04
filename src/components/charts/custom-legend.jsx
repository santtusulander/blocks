import React, { PropTypes } from 'react'

const CustomLegend = ({ data = [] }) =>
  <div className="rechart-legend">
    {data.map(({ name, className }, i) =>
      <div key={i} id="legend-item" className="legend-item">
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
