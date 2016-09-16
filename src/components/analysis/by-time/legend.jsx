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
              'comparison': dataset.comparisonData})}>
              <span className="legend-line" id='legend-line' style={{color: dataset.color}}>&mdash; </span>
              {dataset.label}
            </span>
            <span id='legend-value' className='legend-value'>{values[i]}</span>
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
