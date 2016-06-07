import React from 'react'
import './legend.scss'

const Legend = (props) => {

  const {primaryLabel, secondaryLabel, primaryValue, secondaryValue} = props

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
    </div>
  )
}

Legend.propTypes = {
  primaryLabel: React.PropTypes.string,
  primaryValue: React.PropTypes.string,
  secondaryLabel: React.PropTypes.string,
  secondaryValue: React.PropTypes.string
}

export default Legend
