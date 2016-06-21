import React from 'react'

import FilterDateRange from '../analysis/filters/date-range.jsx'
import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterPop from '../analysis/filters/pop.jsx'
import FilterOnOffNet from '../analysis/filters/on-off-net.jsx'
import FilterServiceType from '../analysis/filters/service-type.jsx'

import './analytics-filters.scss'

const serviceProviderOpts = [
  ['all', 'All'],
  ['option', 'Option']
]

const popOpts = [
  ['all', 'All'],
  ['option', 'Option']
]

const AnalyticsFilters = (props) => {
  return (
    <div className='analytics-filters'>

      <div className='filter'>
        <FilterDateRange
          changeDateRange={ (startDate, endDate) => { props.onFilterChange('dateRange', {startDate: startDate, endDate: endDate})} }
          startDate={props.filters.get('dateRange').startDate}
          startDate={props.filters.get('dateRange').endDate}
        />
      </div>

      <div className='filter'>
        <FilterServiceProvider
          changeServiceProvider={ (val) => { props.onFilterChange('serviceProvider', val ) } }
          options={ serviceProviderOpts }
          value={props.filters.get('serviceProvider')}
        />
      </div>
      <div className='filter'>
        <FilterPop
          changePop={ (val) => { props.onFilterChange('pop', val ) } }
          options={popOpts}
          value={props.filters.get('pop')}
        />
      </div>
      <div className='filter'>
        <FilterOnOffNet
          changeOnOffNet={ (val) => { props.onFilterChange('onOffNet', val ) } }
        />
      </div>

      <div className='filter'>
        <FilterServiceType
          serviceTypes={props.filters.get('serviceTypes')}
          toggleServiceType={ (val) => { props.onFilterChange('serviceTypes', val ) } }
        />
      </div>
    </div>
  )
}

export default AnalyticsFilters
