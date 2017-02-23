import React, { PropTypes } from 'react'
import MiniChart from '../mini-chart'
import ComparisonBars from './comparison-bars'

const StorageKPI = ({
  chartData,
  chartDataKey,
  currentValue,
  gainPercentage,
  locations,
  peakValue,
  referenceValue,
  valuesUnit
}) => {
  return (
    <div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Current</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>{currentValue}</span>
            <span className='suffix'>/ {referenceValue} {valuesUnit.toUpperCase()}</span>
          </div>
          <div className='storage-kpi-comparison-bars'>
            <ComparisonBars referenceValue={referenceValue} currentValue={currentValue} />
          </div>
        </div>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Peak</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>{peakValue}</span>
            <span className='suffix'>{valuesUnit.toUpperCase()}</span>
          </div>
        </div>
        <span className='storage-kpi-item-note'>(this month)</span>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Gain</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>{`${gainPercentage >= 0 ? '+' : '-'} ${Math.abs(gainPercentage)}%`}</span>
          </div>
          <div className='storage-kpi-chart'>
            <MiniChart
              dataKey={chartDataKey}
              data={chartData}
              />
          </div>
        </div>
        <span className='storage-kpi-item-note'>(this month)</span>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Location</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-text'>{locations.join(', ')}</div>
        </div>
      </div>
    </div>
  )
}

StorageKPI.displayName = "StorageKPI"
StorageKPI.propTypes = {
  chartData: PropTypes.array,
  chartDataKey: PropTypes.string,
  currentValue: PropTypes.number,
  gainPercentage: PropTypes.number,
  locations: PropTypes.array,
  peakValue: PropTypes.number,
  referenceValue: PropTypes.number,
  valuesUnit: PropTypes.string
}
export default StorageKPI
