import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'
import { List, Map } from 'immutable'
import { FormattedMessage } from 'react-intl'

import PageHeader from '../layout/page-header'
import FilterDateRange from '../analysis/filters/date-range'
import ProviderTypes from '../../constants/provider-types'
import {
  userIsServiceProvider,
  userIsContentProvider,
  userIsCloudProvider
} from '../../util/helpers.js'

import FilterServiceProvider from '../analysis/filters/service-provider.jsx'
import FilterContentProvider from '../analysis/filters/content-provider.jsx'
import FilterOnOffNet from '../analysis/filters/on-off-net.jsx'
import FilterServiceType from '../analysis/filters/service-type.jsx'
import FilterVideo from '../analysis/filters/video.jsx'
import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'
import FilterRecordType from '../analysis/filters/record-type.jsx'

function getToggledValues( currentValues, toggleVal) {
  if (currentValues.includes(toggleVal)) {
    return currentValues.filter( (val ) => {
      return val.toLowerCase() !== toggleVal.toLowerCase()
    })
  }

  return currentValues.push( toggleVal )
}

const StatusCodes = ({ errorCodesOnly, options, values, onChange }) => {
  const
    isChecked = option =>
      option.filter(option => values.findIndex(value => value === option) >= 0).length === option.length,
    fiveHundreds = [500, 501, 502, 503],
    fourHundreds = [400, 401, 402, 403, 404, 405, 411, 412, 413],
    twoHundreds = [200, 201, 202, 204],
    twoHundredsChecked = isChecked(twoHundreds),
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
      {!errorCodesOnly &&
        <li role="presentation" className="children">
          <Input type="checkbox"
            label='2XX'
            value={twoHundreds}
            checked={twoHundredsChecked}
            onChange={handleCheck(twoHundreds, twoHundredsChecked)}/>
        </li>
      }
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
  errorCodesOnly: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.instanceOf(List),
  values: PropTypes.instanceOf(List)
}

const AnalyticsFilters = (props) => {
  const {
    activeAccountProviderType,
    currentUser
  } = props

  /* Filter options for FilterServiceProvider and FilterContentProvider */
  let spFilterOptions = []
  let cpFilterOptions = []

  // the following builds the dropdown list based off of current user role
  if (userIsServiceProvider(currentUser)) {
    cpFilterOptions = ['cp-account']
    spFilterOptions = ['sp-group']
  } else if (userIsContentProvider(currentUser)) {
    cpFilterOptions = ['cp-account','cp-group','cp-property']

    // spFilterOptions = ['sp-account','sp-group'] // TODO: uncomment line as part of UDNP-1577
    spFilterOptions = ['sp-account'] // TODO: delete line as part of UDNP-1577
  } else if (userIsCloudProvider(currentUser)) {
    cpFilterOptions = ['cp-account','cp-group','cp-property']
    spFilterOptions = ['sp-account','sp-group']
  }

  // the following hides certain dropdowns based on GAS status and current user role
  if (
    activeAccountProviderType === ProviderTypes.SERVICE_PROVIDER ||
    activeAccountProviderType === ProviderTypes.CLOUD_PROVIDER
  ) {
    spFilterOptions = []
  } else if (activeAccountProviderType === ProviderTypes.CONTENT_PROVIDER) {
    cpFilterOptions = []
  }

  return (
    <PageHeader secondaryPageHeader={true}>
      {props.showFilters.includes('date-range') &&

        <FilterDateRange
          startDate={props.filters.getIn(['dateRange','startDate'])}
          endDate={props.filters.getIn(['dateRange','endDate'])}
          dateRanges={props.dateRanges}
          showComparison={props.showFilters.includes('comparison')}
          onFilterChange={props.onFilterChange}
          includeComparison={props.filters.get('includeComparison')}/>}

      {(props.showFilters.includes('service-provider') && spFilterOptions.length > 0) &&
        <FilterServiceProvider
          visibleFields={spFilterOptions}
          changeServiceProvider={val => {
            props.onFilterChange('serviceProviders', val)
          }}
          changeServiceProviderGroup={val => {
            props.onFilterChange('serviceProviderGroups', val)
          }}
          serviceProviderOptions={props.filterOptions.get('serviceProviders')}
          serviceProviderValue={props.filters.get('serviceProviders')}
          serviceProviderGroupOptions={props.filterOptions.get('serviceProviderGroups')}
          serviceProviderGroupValue={props.filters.get('serviceProviderGroups')}
          />
      }

      {(props.showFilters.includes('content-provider') && cpFilterOptions.length > 0) &&
        <FilterContentProvider
          visibleFields={cpFilterOptions}
          changeContentProvider={val => {
            props.onFilterChange('contentProviders', val)
          }}
          changeContentProviderGroup={val => {
            props.onFilterChange('contentProviderGroups', val)
          }}
          changeContentProviderProperty={val => {
            props.onFilterChange('contentProviderProperties', val)
          }}
          contentProviderOptions={props.filterOptions.get('contentProviders')}
          contentProviderValue={props.filters.get('contentProviders')}
          contentProviderGroupOptions={props.filterOptions.get('contentProviderGroups')}
          contentProviderGroupValue={props.filters.get('contentProviderGroups')}
          contentProviderPropertyOptions={props.filterOptions.get('contentProviderProperties')}
          contentProviderPropertyValue={props.filters.get('contentProviderProperties')}
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
            errorCodesOnly={true}
            options={props.filterOptions.get('errorCodes')}
            values={props.filters.get('errorCodes')}
            onChange={values => props.onFilterChange('errorCodes', values.toJS())}/>
        </div>
      }

      {props.showFilters.includes('status-code') &&
        <div className='action'>
          <h5><FormattedMessage id="portal.analysis.filters.statusCodes.title"/></h5>
          <StatusCodes
            errorCodesOnly={false}
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
  activeAccountProviderType: PropTypes.number,
  currentUser: PropTypes.instanceOf(Map),
  dateRanges: PropTypes.array.isRequired,
  filterOptions: PropTypes.instanceOf(Map),
  filters: PropTypes.instanceOf(Map),
  onFilterChange: PropTypes.func,
  params: PropTypes.object,
  showFilters: PropTypes.instanceOf(List)
}

AnalyticsFilters.defaultProps = {
  filters: Map(),
  filterOptions: Map(),
  showFilters: Map()
}

export default AnalyticsFilters
