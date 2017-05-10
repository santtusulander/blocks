import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import SectionContainer from '../shared/layout/section-container'
import MiniChart from '../charts/mini-chart'
import ComparisonBars from './comparison-bars'
import TruncatedTitle from '../shared/page-elements/truncated-title'
import { isDefined } from '../../util/helpers'

/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
const KPIFormattedMessage = ({id, type}) => (
  <FormattedMessage id={id}>
    {(formattedTitle) => (
      <span className={`storage-kpi-item-${type}`}>{formattedTitle}</span>
    )}
  </FormattedMessage>
)

KPIFormattedMessage.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(['title', 'note'])
}

const StorageKPI = ({
  chartData,
  chartDataKey,
  currentValue,
  gainPercentage,
  locations,
  peakValue,
  referenceValue,
  showLabels,
  valuesUnit
}) => {
  return (
    <SectionContainer>
      <div className='storage-kpi-item'>
        {showLabels && <KPIFormattedMessage id='portal.storage.kpi.current.title' type='title' />}
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <TruncatedTitle className='value' content={currentValue.toString()} />
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
      {isDefined(peakValue) &&
        <div className='storage-kpi-item'>
        {showLabels && <KPIFormattedMessage id='portal.storage.kpi.peak.title' type='title' />}
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <TruncatedTitle className='value' content={peakValue.toString()} />
            <span className='suffix'>{valuesUnit.toUpperCase()}</span>
          </div>
        </div>
        <KPIFormattedMessage id='portal.storage.kpi.note.thisMonth' type='note' />
      </div>
      }

      {isDefined(gainPercentage) &&
        <div className='storage-kpi-item'>
          {showLabels && <KPIFormattedMessage id='portal.storage.kpi.gain.title' type='title' />}
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
          <KPIFormattedMessage id='portal.storage.kpi.note.thisMonth' type='note' />
        </div>
      }
      {isDefined(locations) &&
      <div className='storage-kpi-item'>
        {showLabels && <KPIFormattedMessage id='portal.storage.kpi.location.title' type='title' />}
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-text'>{locations.join(', ')}</div>
        </div>
      </div>
      }
    </SectionContainer>
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
  showLabels: PropTypes.bool,
  valuesUnit: PropTypes.string
}

StorageKPI.defaultProps = {
  showLabels: true
}

export default StorageKPI
