import React from 'react'

import FilterDateRange from '../analysis/filters/date-range.jsx'
import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterPop from '../analysis/filters/pop.jsx'
import FilterOnOffNet from '../analysis/filters/on-off-net.jsx'
import FilterServiceType from '../analysis/filters/service-type.jsx'

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

      <FilterDateRange
        changeDateRange={ (startDate, endDate) => { props.onFilterChange('dateRange', {startDate: startDate, endDate: endDate})} }
        startDate={props.filters.get('dateRange').startDate}
        startDate={props.filters.get('dateRange').endDate}
      />

      <FilterServiceProvider
        changeServiceProvider={ (val) => { props.onFilterChange('serviceProvider', val ) } }
        options={ serviceProviderOpts }
        value={props.filters.get('serviceProvider')}
      />
      <FilterPop
        changePop={ (val) => { props.onFilterChange('pop', val ) } }
        options={popOpts}
        value={props.filters.get('pop')}
      />

      <FilterOnOffNet
        changeOnOffNet={ (val) => { props.onFilterChange('onOffNet', val ) } }
      />

      <FilterServiceType
        serviceTypes={props.filters.get('serviceTypes')}
        toggleServiceType={ (val) => { props.onFilterChange('serviceTypes', val ) } }
      />

    </div>
  )
}

export default AnalyticsFilters
