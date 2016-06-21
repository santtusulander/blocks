import React from 'react'

//import FilterDateRange from '../analysis/filters/date-range.jsx'

import DateRangeFilter from '../analysis/filters/date-range-filter/date-range-filter.jsx'

import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterPop from '../analysis/filters/pop.jsx'
import FilterOnOffNet from '../analysis/filters/on-off-net.jsx'
//import FilterServiceType from '../analysis/filters/service-type.jsx'

import FilterChecklistDropdown from '../analysis/filters/filter-checklist-dropdown/filter-checklist-dropdown.jsx'

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

    { props.showFilters.includes('date-range') &&
      <div className='filter'>
        <div className="sidebar-section-header">
        Date Range
        </div>
        <DateRangeFilter
        changeDateRange={ (startDate, endDate) => {
          props.onFilterChange('dateRange', {startDate: startDate, endDate: endDate})
        } }
        startDate={props.filters.get('dateRange').startDate}
        endDate={props.filters.get('dateRange').endDate}
        />
      </div>
    }

    { props.showFilters.includes('service-provider') &&
      <div className='filter'>
        <FilterServiceProvider
        changeServiceProvider={ (val) => {
          props.onFilterChange('serviceProvider', val)
        } }
        options={ serviceProviderOpts }
        value={props.filters.get('serviceProvider')}
        />
      </div>
    }

    { props.showFilters.includes('pop') &&
      <div className='filter'>
        <FilterPop
        changePop={ (val) => {
          props.onFilterChange('pop', val)
        } }
        options={popOpts}
        value={props.filters.get('pop')}
        />
      </div>
    }

    { props.showFilters.includes('on-off-net') &&
      <div className='filter'>
        <FilterOnOffNet
        changeOnOffNet={ (val) => {
          props.onFilterChange('onOffNet', val)
        } }
        />
      </div>
    }
    { props.showFilters.includes('service-type') &&
      <div className='filter'>
        <FilterChecklistDropdown
          options={props.filters.get('serviceTypes')}
          handleCheck={ (val) => { props.onFilterChange('serviceTypes', val)} }
        />
      </div>
    }
    </div>
  )
}

export default AnalyticsFilters
