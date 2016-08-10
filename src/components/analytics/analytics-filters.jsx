import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'
import { List, Map } from 'immutable'

import DateRangeSelect from '../date-range-select.jsx'
import DateRanges from '../../constants/date-ranges'

import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterPop from '../analysis/filters/pop.jsx'
import FilterOnOffNet from '../analysis/filters/on-off-net.jsx'
import FilterServiceType from '../analysis/filters/service-type.jsx'
import FilterVideo from '../analysis/filters/video.jsx'
import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'

import './analytics-filters.scss'

const serviceProviderOpts = [
  ['all', 'All'],
  ['vodafone-group', 'Vodafone Group'],
  ['telstra', 'Telstra'],
  ['bharti', 'Bharti'],
  ['singtel', 'Singtel'],
  ['china-telecom', 'China Telecom'],
  ['hgc', 'HGC'],
  ['ais', 'AIS'],
  ['tot', 'TOT'],
  ['cht', 'CHT'],
  ['fet', 'FET'],
  ['xl-axiata', 'XL Axiata'],
  ['telkom-indonesia', 'Telkom Indonesia'],
  ['globe', 'Globe'],
  ['mobifone', 'Mobifone'],
  ['sk-bb', 'SK BB'],
  ['lg-u', 'LG U+]']
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

const StatusCodes = ({ options, values, onChange }) => {
  const
    isChecked = option =>
      option.filter(option => values.findIndex(value => value === option) >= 0).length === option.length,
    fiveHundreds = [ '500', '501', '502', '503' ],
    fourHundreds = [ '400', '401', '402', '403', '404', '405', '411', '412', '413' ],
    fourHundredsChecked = isChecked(fourHundreds),
    fiveHundredsChecked = isChecked(fiveHundreds),
    handleCheck = (optionValue, checked) => () => {
      if(checked) {
        values = values.filter(value => optionValue.findIndex(selected => selected === value) < 0)
      } else {
        optionValue.forEach(item => {
          if(!values.includes(item)) {
            values = values.push(item)
          }
        })
      }
      onChange(values)
    }
  return (
    <FilterChecklistDropdown
      noClear={true}
      options={options}
      value={values}
      handleCheck={onChange}>
      <li role="presentation" className="children">
        <Input type="checkbox"
          label='4XX'
          value={fourHundreds}
          checked={fourHundredsChecked}
          onChange={handleCheck(fourHundreds, fourHundredsChecked)}/>
      </li>
      <li role="presentation" className="children">
        <Input type="checkbox"
          label='5XX'
          value={fiveHundreds}
          checked={fiveHundredsChecked}
          onChange={handleCheck(fiveHundreds, fiveHundredsChecked)}/>
      </li>
    </FilterChecklistDropdown>
  )
}

StatusCodes.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.instanceOf(List),
  values: PropTypes.instanceOf(List)
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
          <div className="sidebar-section-header">
          Status Codes
          </div>
          <StatusCodes
            options={props.filterOptions.get('statusCodes')}
            values={props.filters.get('statusCodes')}
            onChange={values => props.onFilterChange('statusCodes', values.toJS())}/>
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
  filterOptions: PropTypes.instanceOf(Map),
  filters: PropTypes.instanceOf(Map),
  onFilterChange: PropTypes.func,
  showFilters: PropTypes.instanceOf(Map)
}

AnalyticsFilters.defaultProps = {
  filters: Map(),
  filterOptions: Map(),
  showFilters: Map()
}

export default AnalyticsFilters
