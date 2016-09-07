import React from 'react'
import classNames from 'classnames'
import './legend.scss'

const Legend = ({dataSets, values}) => {
  return (
    <div className='chart-legend'>
      {dataSets.map((dataset, i) => {
        return (
          <div key={i} className="legend-item">
            <span className={classNames({
              'legend-label': true,
              [`${dataset.color}`]: true,
              'comparison': dataset.isComparison})}>
              {dataset.label}
            </span>
            <span className='legend-value'>{values[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

Legend.propTypes = {
  dataSets: React.PropTypes.array,
  values: React.PropTypes.array
}

export default Legend
