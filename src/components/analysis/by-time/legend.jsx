import React from 'react'
import classNames from 'classnames'
import './legend.scss'

const Legend = ({colors, isComparison, labels, values}) => {
  return (
    <div className='chart-legend'>
      {labels.map((label, i) => {
        return (
          <div key={i} className="legend-item">
            <span className={classNames({
              'legend-label': true,
              [`${colors[i]}`]: true,
              'comparison': isComparison[i]})}>
              {label}
            </span>
            <span className='legend-value'>{values[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

Legend.propTypes = {
  colors: React.PropTypes.array,
  isComparison: React.PropTypes.array,
  labels: React.PropTypes.array,
  values: React.PropTypes.array
}

export default Legend
