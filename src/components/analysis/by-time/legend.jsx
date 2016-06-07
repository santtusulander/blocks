import React from 'react'

import AnalysisLineLabel from './line-label'

import './legend.scss'

const Legend = (props) => {
  console.log(props);

  const {primaryLabel, secondaryLabel, primaryValue, secondaryValue} = props

  return (
    <div className='chart-legend'>

      {primaryLabel && <div className='legend-item'>
        <span className='legend-label primary'>{primaryLabel}</span>
        <span className='legend-value'>{primaryValue}</span>
      </div>}

      {secondaryLabel && <div className='legend-item'>
        <span className='legend-label secondary'>{secondaryLabel}</span>
        <span className='legend-value'>{secondaryValue}</span>
      </div>}
    </div>
  )
}

Legend.propTypes = {
  primaryLabel: React.PropTypes.string,
  primaryTooltipText: React.PropTypes.string,
  secondaryLabel: React.PropTypes.string,
  secondaryTooltipText: React.PropTypes.string,
}

export default Legend
