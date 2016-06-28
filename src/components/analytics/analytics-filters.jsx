import React from 'react'
import Immutable from 'immutable'

import DateRangeSelect from '../date-range-select.jsx'
import DateRanges from '../../constants/date-ranges'

import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterPop from '../analysis/filters/pop.jsx'
import FilterOnOffNet from '../analysis/filters/on-off-net.jsx'
import FilterServiceType from '../analysis/filters/service-type.jsx'
import FilterVideo from '../analysis/filters/video.jsx'

import './analytics-filters.scss'

const serviceProviderOpts = [
  ['all', 'All'],
  ['option', 'Option']
]

const popOpts = [
  ['all', 'All'],
  ['option', 'Option']
]

function getToggledValues( currentValues, toggleVal) {
  if (currentValues.includes(toggleVal)) {
    return currentValues.filter( (val ) => {
      return val.toLowerCase() !== toggleVal.toLowerCase()
    })
  }

  return currentValues.push( toggleVal )
}

const AnalyticsFilters = (props) => {
  return (
    <div className='analytics-filters'>

      {props.showFilters.includes('date-range') &&
        <div className='filter'>
          <div className="sidebar-section-header">
            Date Range
          </div>
          <DateRangeSelect
            changeDateRange={(startDate, endDate) => {
              props.onFilterChange('dateRange', {startDate: startDate, endDate: endDate})
            }}
            startDate={props.filters.getIn(['dateRange','startDate'])}
            endDate={props.filters.getIn(['dateRange','endDate'])}
            availableRanges={[
              DateRanges.MONTH_TO_DATE,
              DateRanges.LAST_MONTH,
              DateRanges.TODAY,
              DateRanges.YESTERDAY,
              DateRanges.CUSTOM_TIMERANGE
            ]}/>
        </div>
      }

      {props.showFilters.includes('service-provider') &&
        <div className='filter'>
          <FilterServiceProvider
          changeServiceProvider={val => {
            props.onFilterChange('serviceProvider', val)
          }}
          options={serviceProviderOpts}
          value={props.filters.get('serviceProvider')}
          />
        </div>
      }

      {props.showFilters.includes('pop') &&
        <div className='filter'>
          <FilterPop
          changePop={val => {
            props.onFilterChange('pop', val)
          }}
          options={popOpts}
          value={props.filters.get('pop')}
          />
        </div>
      }

      {props.showFilters.includes('on-off-net') &&
        <div className='filter'>
          <FilterOnOffNet
            onOffNetValues={props.filters.get('onOffNet')}
            toggleFilter={val => {
              props.onFilterChange(
                'onOffNet',
                getToggledValues( props.filters.get('onOffNet'), val)
              )
            }}
          />
        </div>
      }
      {props.showFilters.includes('service-type') &&
        <div className='filter'>
          <div className="sidebar-section-header">
            Service Types
          </div>

          {/*<FilterChecklistDropdown
            options={props.filterOptions.get('serviceTypes')}
            handleCheck={ (val) => { props.onFilterChange('serviceTypes', val)} }
          />*/}

          <FilterServiceType
            serviceTypes={props.filters.get('serviceTypes')}
            toggleServiceType={val => {
              props.onFilterChange(
                'serviceTypes',
                getToggledValues( props.filters.get('serviceTypes'), val)
              )
            }}
          />
        </div>
      }

      {props.showFilters.includes('error-code') &&
        <div className='filter'>
          <FilterServiceType
            serviceTypes={props.filters.get('errorCodes')}
            toggleServiceType={val => {
              props.onFilterChange('errorCodes', val)
            }}
          />
        </div>
      }

      {props.showFilters.includes('video') &&
        <div className='filter'>
          <FilterVideo
            value={props.filters.get('video')}
            changeVideo={val => {
              props.onFilterChange('video', val)
            }}
          />
        </div>
      }
    </div>
  )
}

AnalyticsFilters.propTypes = {
  filters: React.PropTypes.instanceOf(Immutable.Map),
  onFilterChange: React.PropTypes.func,
  showFilters: React.PropTypes.instanceOf(Immutable.Map)
}

AnalyticsFilters.defaultProps = {
  filters: Immutable.Map(),
  showFilters: Immutable.Map()
}

export default AnalyticsFilters
