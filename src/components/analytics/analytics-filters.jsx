import React, { PropTypes } from 'react'
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
import FilterRecordType from '../analysis/filters/record-type.jsx'
import FilterCustomDateRange from '../analysis/filters/custom-date-range'
import StatusCodes from './analytics-status-codes'
import FilterStorageType from '../analysis/filters/storage-type'

function getToggledValues( currentValues, toggleVal) {
  if (currentValues.includes(toggleVal)) {
    return currentValues.filter( (val ) => {
      return val.toLowerCase() !== toggleVal.toLowerCase()
    })
  }

  return currentValues.push( toggleVal )
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
    <PageHeader secondaryPageHeader={true} className="analytics-filters">

      {props.showFilters.includes('dateRange') &&
        <FilterDateRange
          startDate={props.filters.getIn(['dateRange','startDate'])}
          endDate={props.filters.getIn(['dateRange','endDate'])}
          dateRanges={props.dateRanges}
          showComparison={props.showFilters.includes('includeComparison')}
          onFilterChange={props.onFilterChange}
          includeComparison={props.filters.get('includeComparison')}/>}

      {props.showFilters.includes('customDateRange') &&
        <FilterCustomDateRange
          startDate={props.filters.getIn(['customDateRange','startDate'])}
          onFilterChange={props.onFilterChange} />}

      {(props.showFilters.includes('serviceProviders') && spFilterOptions.length > 0) &&
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

      {(props.showFilters.includes('contentProviders') && cpFilterOptions.length > 0) &&
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

      {props.showFilters.includes('onOffNet') &&
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

      {props.showFilters.includes('serviceTypes') &&
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

      {props.showFilters.includes('recordType') &&
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

      {props.showFilters.includes('errorCodes') &&
        <div className='action'>
          <h5><FormattedMessage id="portal.analysis.filters.statusCodes.title"/></h5>
          <StatusCodes
            errorCodesOnly={true}
            options={props.filterOptions.get('errorCodes')}
            values={props.filters.get('errorCodes')}
            onChange={values => props.onFilterChange('errorCodes', values.toJS())}/>
        </div>
      }

      {props.showFilters.includes('statusCodes') &&
        <div className='action'>
          <h5><FormattedMessage id="portal.analysis.filters.statusCodes.title"/></h5>
          <StatusCodes
            errorCodesOnly={false}
            options={props.filterOptions.get('statusCodes')}
            values={props.filters.get('statusCodes')}
            onChange={values => props.onFilterChange('statusCodes', values.toJS())}/>
        </div>
      }

      {props.showFilters.includes('storageType') &&
        <div className='action'>
          <FilterStorageType
            storageType={props.filters.get('storageType')}
            toggleStorageType={val => {
              props.onFilterChange(
                'storageType', val
              )
            }}
          />
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

AnalyticsFilters.displayName = "AnalyticsFilters"

AnalyticsFilters.propTypes = {
  activeAccountProviderType: PropTypes.number,
  currentUser: PropTypes.instanceOf(Map),
  dateRanges: PropTypes.array,
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
