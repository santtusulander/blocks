import React from 'react'
import classNames from 'classnames'

function Legend({dataSets, values}) {
  return (
    <div className='by-time-legend'>
      {dataSets.map((dataset, i) => {
        return (
          <div key={i} className="by-time-legend-item">
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

Legend.displayName = 'Legend'
Legend.propTypes = {
  dataSets: React.PropTypes.array,
  values: React.PropTypes.array
}

export default Legend
