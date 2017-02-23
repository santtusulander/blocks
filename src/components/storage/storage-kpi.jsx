import React, { PropTypes } from 'react'
import { injectIntl, intlShape} from 'react-intl'
import MiniChart from '../mini-chart'
import ComparisonBars from './comparison-bars'

const StorageKPI = ({
  chartData,
  chartDataKey,
  currentValue,
  gainPercentage,
  intl,
  locations,
  peakValue,
  referenceValue,
  valuesUnit
}) => {
  return (
    <div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>
          {intl.formatMessage({id: 'portal.storage.kpi.current.title'})}
        </span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>{currentValue}</span>
            <span className='suffix'>
              {`/ ${referenceValue} ${valuesUnit.toUpperCase()}`}
            </span>
          </div>
          <div className='storage-kpi-comparison-bars'>
            <ComparisonBars
              referenceValue={referenceValue}
              currentValue={currentValue} />
          </div>
        </div>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>
          {intl.formatMessage({id: 'portal.storage.kpi.peak.title'})}
        </span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>{peakValue}</span>
            <span className='suffix'>{valuesUnit.toUpperCase()}</span>
          </div>
        </div>
        <span className='storage-kpi-item-note'>
          {intl.formatMessage({id: 'portal.storage.kpi.note.thisMonth'})}
        </span>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>
          {intl.formatMessage({id: 'portal.storage.kpi.gain.title'})}
        </span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>
              {`${(gainPercentage > 0) ? '+' : ''}${gainPercentage.toFixed(1)}%`}
            </span>
          </div>
          <div className='storage-kpi-chart'>
            <MiniChart
              dataKey={chartDataKey}
              data={chartData}
              />
          </div>
        </div>
        <span className='storage-kpi-item-note'>
          {intl.formatMessage({id: 'portal.storage.kpi.note.thisMonth'})}
        </span>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>
          {intl.formatMessage({id: 'portal.storage.kpi.location.title'})}
        </span>
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
  intl: intlShape,
  locations: PropTypes.array,
  peakValue: PropTypes.number,
  referenceValue: PropTypes.number,
  valuesUnit: PropTypes.string
}
export default injectIntl(StorageKPI)
