import React from 'react'
import './legend.scss'

const Legend = ({primaryLabel, secondaryLabel, primaryValue, secondaryValue, comparisonLabel}) => {
  return (
    <div className='chart-legend'>

      {primaryLabel && <div className='legend-item primary'>
        <span className='legend-label'>{primaryLabel}</span>
        <span className='legend-value'>{primaryValue}</span>
      </div>}

      {secondaryLabel && <div className='legend-item secondary'>
        <span className='legend-label'>{secondaryLabel}</span>
        <span className='legend-value'>{secondaryValue}</span>
      </div>}

      {comparisonLabel && <div className='legend-item comparison'>
        <svg className='legend-label' width="12" height="12">
          <circle cx="6" cy="6" r="6" className="secondary-label"/>
        </svg>
        <span className='legend-label'>{comparisonLabel}</span>
        <span className='legend-value'>{secondaryValue}</span>
      </div>}
    </div>
  )
}

Legend.propTypes = {
  comparisonLabel: React.PropTypes.string,
  primaryLabel: React.PropTypes.string,
  primaryValue: React.PropTypes.string,
  secondaryLabel: React.PropTypes.string,
  secondaryValue: React.PropTypes.string
}

export default Legend
