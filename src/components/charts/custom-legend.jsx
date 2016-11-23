import React, { PropTypes } from 'react'

/**
 * Reverse data to get legend entries in right order, concat to clone the array.
 */

const CustomLegend = ({ data = [] }) =>
  <div className="rechart-legend">
    {data.concat().reverse().map(({ name, className }, i) =>
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
