import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'
import { List, Map, fromJS } from 'immutable'
import { FormattedMessage } from 'react-intl'

import PageHeader from '../layout/page-header'
import DateRangeSelect from '../date-range-select.jsx'
import DateRanges from '../../constants/date-ranges'
import ProviderTypes from '../../constants/provider-types'

import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterContentProvider from '../analysis/filters/content-provider.jsx'
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

// TODO: placeholder data
const serviceProviderGroups = fromJS([
  {value: 0, label: 'Group 0'},
  {value: 1, label: 'Group 1'},
  {value: 2, label: 'Group 2'},
  {value: 3, label: 'Group 3'},
  {value: 4, label: 'Group 4'},
  {value: 5, label: 'Group 5'}
])

// TODO: placeholder data
const contentProviders = fromJS([
  {value: 0, label: 'Content Provider 0'},
  {value: 1, label: 'Content Provider 1'},
  {value: 2, label: 'Content Provider 2'},
  {value: 3, label: 'Content Provider 3'},
  {value: 4, label: 'Content Provider 4'},
  {value: 5, label: 'Content Provider 5'}
])

// TODO: placeholder data
const contentProviderGroups = fromJS([
  {value: 0, label: 'Group 0'},
  {value: 1, label: 'Group 1'},
  {value: 2, label: 'Group 2'},
  {value: 3, label: 'Group 3'},
  {value: 4, label: 'Group 4'},
  {value: 5, label: 'Group 5'}
])

// TODO: placeholder data
const contentProviderProperties = fromJS([
  {value: 0, label: 'Property 0'},
  {value: 1, label: 'Property 1'},
  {value: 2, label: 'Property 2'},
  {value: 3, label: 'Property 3'},
  {value: 4, label: 'Property 4'},
  {value: 5, label: 'Property 5'}
])

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
  /* Filter options for FilterServiceProvider and FilterContentProvider */
  let spFilterOptions = []
  let cpFilterOptions = []

  switch (props.providerType) {
    case ProviderTypes.CONTENT_PROVIDER:
      cpFilterOptions = ['cp-group','cp-property']
      spFilterOptions = ['sp-account','sp-group']
      break;
    case ProviderTypes.SERVICE_PROVIDER:
      cpFilterOptions = ['cp-account']
      spFilterOptions = ['sp-group']
      break;
    case ProviderTypes.CLOUD_PROVIDER:
      cpFilterOptions = ['cp-account','cp-group','cp-property']
      spFilterOptions = ['sp-account','sp-group']
      break;
    default:
      /* No account selected - user is UDN Admin - show all */
      cpFilterOptions = ['cp-account','cp-group','cp-property']
      spFilterOptions = ['sp-account','sp-group']
  }

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
        <FilterServiceProvider
          visibleFields={spFilterOptions}
          changeServiceProvider={val => {
            props.onFilterChange('serviceProviders', val)
          }}
          changeServiceProviderGroup={val => console.log('changed CP group: ' + val)}
          serviceProviderOptions={props.filterOptions.get('serviceProviders')}
          serviceProviderValue={props.filters.get('serviceProviders')}
          serviceProviderGroupOptions={serviceProviderGroups}
          serviceProviderGroupValue={fromJS([])}
          />
      }

      {props.showFilters.includes('content-provider') &&
        <FilterContentProvider
          visibleFields={cpFilterOptions}
          changeContentProvider={val => console.log('changed CP: ' + val)}
          changeContentProviderGroup={val => console.log('changed CP group: ' + val)}
          changeContentProviderProperty={val => console.log('changed cp property: ' + val)}
          contentProviderOptions={contentProviders}
          contentProviderValue={fromJS([])}
          contentProviderGroupOptions={contentProviderGroups}
          contentProviderGroupValue={fromJS([])}
          contentProviderPropertyOptions={contentProviderProperties}
          contentProviderPropertyValue={fromJS([])}
          />
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
  providerType: PropTypes.number,
  showFilters: PropTypes.instanceOf(List)
}

AnalyticsFilters.defaultProps = {
  filters: Map(),
  filterOptions: Map(),
  showFilters: Map()
}

export default AnalyticsFilters
