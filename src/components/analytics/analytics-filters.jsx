import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'
import { List, Map } from 'immutable'
import { FormattedMessage } from 'react-intl'

import PageHeader from '../layout/page-header'

import DateRangeSelect from '../date-range-select.jsx'
import DateRanges from '../../constants/date-ranges'

import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterOnOffNet from '../analysis/filters/on-off-net.jsx'
import FilterServiceType from '../analysis/filters/service-type.jsx'
import FilterVideo from '../analysis/filters/video.jsx'
import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'
import FilterRecordType from '../analysis/filters/record-type.jsx'
import FilterIncludeComparison from '../analysis/filters/include-comparison.jsx'

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
    <PageHeader secondaryPageHeader={true}>
      {props.showFilters.includes('date-range') &&
        <div className='action'>
          <h5><FormattedMessage id="portal.analysis.filters.dateRange.title"/></h5>
          <DateRangeSelect
            changeDateRange={(startDate, endDate, activeDateRange) => {
              props.onFilterChange(
                'dateRange', {startDate: startDate, endDate: endDate}
              )
              props.onFilterChange(
                'dateRangeLabel', activeDateRange
              )
            }}
            startDate={props.filters.getIn(['dateRange','startDate'])}
            endDate={props.filters.getIn(['dateRange','endDate'])}
            availableRanges={[
              DateRanges.MONTH_TO_DATE,
              DateRanges.LAST_MONTH,
              DateRanges.THIS_WEEK,
              DateRanges.TODAY,
              DateRanges.YESTERDAY,
              DateRanges.CUSTOM_TIMERANGE
            ]}/>
          {props.showFilters.includes('comparison') &&
            <FilterIncludeComparison
              includeComparison={props.filters.get('includeComparison')}
              toggleComparison={val => {
                props.onFilterChange(
                  'includeComparison', val
                )
              }}/>
          }
        </div>
      }

      {props.showFilters.includes('service-provider') &&
        <div className='action'>
          <FilterServiceProvider
          changeServiceProvider={val => {
            props.onFilterChange('serviceProviders', val)
          }}
          options={props.filterOptions.get('serviceProviders')}
          value={props.filters.get('serviceProviders')}
          />
        </div>
      }

      {props.showFilters.includes('on-off-net') &&
        <div className='action'>
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
        <div className='action'>
          <h5><FormattedMessage id="portal.analysis.filters.serviceTypes.title"/></h5>

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

      {props.showFilters.includes('record-type') &&
        <div className='action'>
          <FilterRecordType
            recordType={props.filters.get('recordType')}
            toggleRecordType={val => {
              props.onFilterChange(
                'recordType', val
              )
            }}
          />
        </div>
      }

      {props.showFilters.includes('error-code') &&
        <div className='action'>
          <h5><FormattedMessage id="portal.analysis.filters.statusCodes.title"/></h5>
          <StatusCodes
            options={props.filterOptions.get('statusCodes')}
            values={props.filters.get('statusCodes')}
            onChange={values => props.onFilterChange('statusCodes', values.toJS())}/>
        </div>
      }

      {props.showFilters.includes('video') &&
        <div className='action'>
          <FilterVideo
            value={props.filters.get('video')}
            changeVideo={val => {
              props.onFilterChange('video', val)
            }}
          />
        </div>
      }
    </PageHeader>
  )
}

AnalyticsFilters.propTypes = {
  filterOptions: PropTypes.instanceOf(Map),
  filters: PropTypes.instanceOf(Map),
  onFilterChange: PropTypes.func,
  showFilters: PropTypes.instanceOf(List)
}

AnalyticsFilters.defaultProps = {
  filters: Map(),
  filterOptions: Map(),
  showFilters: Map()
}

export default AnalyticsFilters
