import React from 'react'
import './legend.scss'

const Legend = ({labels, values}) => {
  return (
    <div className='chart-legend'>
      {labels.map((label, i) => {
        return (
          <div className={`legend-item dataset-${i}`} key={i}>
            <span className='legend-label'>{label}</span>
            <span className='legend-value'>{values[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

Legend.propTypes = {
  labels: React.PropTypes.array,
  values: React.PropTypes.array
}

export default Legend
