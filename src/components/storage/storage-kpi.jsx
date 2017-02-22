import React from 'react'
import MiniChart from '../mini-chart'
import ComparisonBars from './comparison-bars'

const StorageKPI = () => {
  return (
    <div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Current</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>112</span>
            <span className='suffix'>/ 100 TB</span>
          </div>
          <div className='storage-kpi-comparison-bars'>
            <ComparisonBars referenceValue={100} currentValue={0} />
          </div>
        </div>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Peak</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>112</span>
            <span className='suffix'>TB</span>
          </div>
        </div>
        <span className='storage-kpi-item-note'>(this month)</span>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Gain</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-number'>
            <span className='value'>+0.2%</span>
          </div>
          <div className='storage-kpi-chart'>
            <MiniChart
              dataKey="bytes"
              data={[
                {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                {bytes: 65000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                {bytes: 45000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                {bytes: 105000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                {bytes: 115000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                {bytes: 190000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')},
                {bytes: 155000, timestamp: new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)')}
              ]}/>
          </div>
        </div>
        <span className='storage-kpi-item-note'>(this month)</span>
      </div>
      <div className='storage-kpi-item'>
        <span className='storage-kpi-item-title'>Location</span>
        <div className='storage-kpi-item-content'>
          <div className='storage-kpi-text'>San Jose, Frankfurt</div>
        </div>
      </div>
    </div>
  )
}

StorageKPI.displayName = "StorageKPI"
export default StorageKPI
