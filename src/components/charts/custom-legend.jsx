import React, { PropTypes } from 'react'

const CustomLegend = ({ data = [], payload }) => {
  if(!data.length && payload.length) {
    data = payload.map((pl) => pl.payload )
  }
  return (
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
  )
}

CustomLegend.displayName = "CustomLegend"
CustomLegend.propTypes = {
  data: PropTypes.array,
  payload: PropTypes.array
}

export default CustomLegend
