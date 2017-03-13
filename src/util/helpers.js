import moment from 'moment'
import numeral from 'numeral'
import { Map, List, fromJS } from 'immutable'
import { getDateRange, getCustomDateRange } from '../redux/util.js'
import { filterNeedsReload } from '../constants/filters.js'
import filesize from 'filesize'
import PROVIDER_TYPES from '../constants/provider-types.js'
import { TOP_URLS_MAXIMUM_NUMBER } from '../constants/url-report.js'
import { ROLES_MAPPING, ACCOUNT_TYPE_SERVICE_PROVIDER, ACCOUNT_TYPE_CONTENT_PROVIDER, ACCOUNT_TYPE_CLOUD_PROVIDER } from '../constants/account-management-options'
import AnalyticsTabConfig from '../constants/analytics-tab-config'
import { getAnalysisStatusCodes, getAnalysisErrorCodes } from './status-codes'
import { MAPBOX_MAX_CITIES_FETCHED } from '../constants/mapbox'

const BYTE_BASE = 1000

export function formatBytes(bytes, setMax, customFormat) {
  let formatted = numeral(bytes / Math.pow(BYTE_BASE, 5)).format(customFormat || '0,0') + ' PB'
  bytes         = bytes || 0

  if((setMax || bytes) < BYTE_BASE) {
    formatted = numeral(bytes).format(customFormat || '0,0') + ' B'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 2)) {
    formatted = numeral(bytes / BYTE_BASE).format(customFormat || '0,0') + ' KB'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 3)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 2)).format(customFormat || '0,0') + ' MB'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 4)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 3)).format(customFormat || '0,0') + ' GB'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 5)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 4)).format(customFormat || '0,0') + ' TB'
  }
  return formatted
}

export function convertToBytes(value, units) {
  switch (units.toLowerCase()) {
    case 'pb':
      return numeral(value * Math.pow(BYTE_BASE, 5)).format('0')

    case 'tb':
      return numeral(value * Math.pow(BYTE_BASE, 4)).format('0')

    case 'gb':
      return numeral(value * Math.pow(BYTE_BASE, 3)).format('0')

    case 'mb':
      return numeral(value * Math.pow(BYTE_BASE, 2)).format('0')

    case 'kb':
      return numeral(value * Math.pow(BYTE_BASE, 1)).format('0')

    case 'b':
      return value

    default:
      return value
  }
}

export function formatBitsPerSecond(bits_per_second, decimals, setMax) {
  const digits    = decimals ? '0,0.00' : '0,0'
  bits_per_second = bits_per_second || 0
  let formatted   = numeral(bits_per_second / Math.pow(BYTE_BASE, 5)).format(digits) + ' Pbps'

  if((setMax || bits_per_second) < BYTE_BASE) {
    formatted = numeral(bits_per_second).format(digits) + ' bps'
  }
  else if((setMax || bits_per_second) < Math.pow(BYTE_BASE, 2)) {
    formatted = numeral(bits_per_second / BYTE_BASE).format(digits) + ' Kbps'
  }
  else if((setMax || bits_per_second) < Math.pow(BYTE_BASE, 3)) {
    formatted = numeral(bits_per_second / Math.pow(BYTE_BASE, 2)).format(digits) + ' Mbps'
  }
  else if((setMax || bits_per_second) < Math.pow(BYTE_BASE, 4)) {
    formatted = numeral(bits_per_second / Math.pow(BYTE_BASE, 3)).format(digits) + ' Gbps'
  }
  else if((setMax || bits_per_second) < Math.pow(BYTE_BASE, 5)) {
    formatted = numeral(bits_per_second / Math.pow(BYTE_BASE, 4)).format(digits) + ' Tbps'
  }
  return formatted
}

export function formatTime(milliseconds) {
  milliseconds  = milliseconds || 0
  let formatted = numeral(milliseconds).format('0,0') + ' ms'

  if(milliseconds >= 60000) {
    formatted = numeral(milliseconds / 60000).format('0,0') + ' m'
  }
  else if(milliseconds >= 1000) {
    formatted = numeral(milliseconds / 1000).format('0,0') + ' s'
  }
  return formatted
}

/**
 * Takes a string value and returns an object with the value and unit separated
 * @param string
 * @returns object
 */
export function separateUnit(stringValue) {
  let separateUnitArray = stringValue.split(' ')
  return {
    'value': separateUnitArray[0],
    'unit': separateUnitArray[1]
  }
}

export function filterMetricsByAccounts(metrics, accounts) {
  return metrics.filter((metric) => {
    return accounts.find((account) => {
      return account.get('id') === metric.get('account')
    });
  });
}

/**
 * Removes properties from the given object.
 * This method is used for removing valid attributes from component props prior to rendering.
 *
 * @param {Object} object
 * @param {Array} remove
 * @returns {Object}
 */
export function removeProps(object, remove) {
  const result = {}

  for(const property in object) {
    if(object.hasOwnProperty(property) && remove.indexOf(property) === -1) {
      result[property] = object[property];
    }
  }

  return result
}

/**
 * Flatten nested array
 *
 * @param arr
 * @returns {Array.<*>}
 */
export function flatten(arr) {
  const flat = [].concat(...arr)
  return flat.some(Array.isArray) ? flatten(flat) : flat;
}

/* REFACTOR: this is a quick fix to get tab links from current path
 - takes the last link part out and replaces it with tabName
 */
export function getTabLink(location, tabName) {
  let linkArr = location.pathname.split('/')

  linkArr.pop()
  linkArr.push(tabName)

  return linkArr.join('/') + location.search
}

/* A helper for returning tabName / url from path - NOT 100% accurate */
export function getTabName(path) {
  let linkArr = path.split('/')
  return linkArr.pop()
}

/* Constructs nested link from linkParts -array */
export function generateNestedLink(base, linkParts) {
  //remove nulls
  linkParts = linkParts.filter((e) => {
    return e
  })

  return base + '/' + linkParts.join("/")
}

export function buildAnalyticsOpts(params, filters, location ){

  const tabKey = getTabName(location.pathname)
  //get array of visible filters for current tab e.g. ["dateRange", "includeComparison", "serviceTypes", "recordType"]
  const visibleFilters = AnalyticsTabConfig.find( tab => tab.get('key') === tabKey ).get('filters')

  //get filter values
  let filterValues = {}
  visibleFilters.forEach( filterName => {
    const filterValue = filters.get( filterName )
    filterValues[filterName] = filterValue && filterValue
  })

  const { startDate, endDate } =
    visibleFilters.includes('dateRange') ?
    getDateRange(filters) :
    visibleFilters.includes('customDateRange') ?
    getCustomDateRange(filters) :
    { startDate: undefined, endDate: undefined }

  const opts = {
    account: params.account,
    brand: params.brand,
    group: params.group,
    property: params.property,
    startDate: toUnixTimestamp( startDate ),
    endDate: toUnixTimestamp( endDate ),
    sp_account_ids: filterValues.serviceProviders && filterValues.serviceProviders.join(','),
    sp_group_ids: filterValues.serviceProviderGroups && filterValues.serviceProviderGroups.join(','),
    account_ids: filterValues.contentProviders && filterValues.contentProviders.join(','),
    group_ids: filterValues.contentProviderGroups && filterValues.contentProviderGroups.join(','),
    service_type: filterValues.serviceTypes && createToggledFilter( filterValues.serviceTypes),
    net_type: filterValues.onOffNet &&  createToggledFilter( filterValues.onOffNet)
  }

  if (filterValues.statusCodes && filterValues.statusCodes.size) {
    opts.status_codes = filterValues.statusCodes.size && filterValues.statusCodes.join(',')
  }

  if (filterValues.errorCodes && filterValues.errorCodes.size) {
    opts.status_codes = filterValues.errorCodes.size && filterValues.errorCodes.join(',')
  }

  return opts
}

/**
 * Returns filter params, if filter is needed ie. not all options selected
 * @param options
 * @returns {*}
 */
const createToggledFilter = ( options ) => {
  //FIXME: this only works when there are only 2 options
  //if all opts selected - remove filter
  if (options.size > 1) return undefined

  return options.toJS()
}

const toUnixTimestamp = ( date ) => {
  return date && date.format('X')
}

export function buildAnalyticsOptsForContribution(params, filters, accountType) {
  const {startDate, endDate} = getDateRange(filters)
  const serviceProviders = filters.get('serviceProviders').size === 0 ? undefined : filters.get('serviceProviders').toJS().join(',')
  const serviceProviderGroups = filters.get('serviceProviderGroups').size === 0 ? undefined : filters.get('serviceProviderGroups').toJS().join(',')
  const contentProviders = filters.get('contentProviders').size === 0 ? undefined : filters.get('contentProviders').toJS().join(',')
  const contentProviderGroups = filters.get('contentProviderGroups').size === 0 ? undefined : filters.get('contentProviderGroups').toJS().join(',')
  const serviceType = filters.get('serviceTypes').size > 1 ? undefined : filters.get('serviceTypes').toJS()
  const netType = filters.get('onOffNet').size > 1 ? undefined : filters.get('onOffNet').get(0)
  const errorCodes = filters.get('errorCodes').size === 0 || filters.get('errorCodes').size === getAnalysisErrorCodes().length ? undefined : filters.get('errorCodes').toJS().join(',')
  const statusCodes = filters.get('statusCodes').size === 0 || filters.get('statusCodes').size === getAnalysisStatusCodes().length ? undefined : filters.get('statusCodes').toJS().join(',')

  if (accountType === PROVIDER_TYPES.CONTENT_PROVIDER) {
    return {
      account: params.account,
      brand: params.brand,
      group: params.group,
      property: params.property,
      startDate: startDate.format('X'),
      endDate: endDate.format('X'),
      sp_account_ids: serviceProviders,
      sp_group_ids: serviceProviderGroups,
      service_type: serviceType,
      net_type: netType,
      status_codes: statusCodes || errorCodes
    }
  } else if (
    accountType === PROVIDER_TYPES.SERVICE_PROVIDER ||
    accountType === PROVIDER_TYPES.CLOUD_PROVIDER
  ) {
    return {
      sp_account: params.account,
      brand: params.brand,
      sp_group: params.group,
      startDate: startDate.format('X'),
      endDate: endDate.format('X'),
      account_ids: contentProviders,
      group_ids: contentProviderGroups,
      service_type: serviceType,
      net_type: netType,
      status_codes: statusCodes || errorCodes
    }
  }

  return null
}

export function filterChangeNeedsReload(currentFilters, nextFilters) {
  let changedFilters = [];

  currentFilters.map((filter, i) => {
    if(filter !== nextFilters.get(i))  changedFilters.push(i)
  })

  const reloadNeeded = changedFilters.reduce((prev, filterName) => {
    if(filterNeedsReload.includes(filterName)) return true;

    return false;
  }, false)

  return reloadNeeded;
}

export function changedParamsFiltersQS(props, nextProps) {
  const params     = JSON.stringify(props.params)
  const prevParams = JSON.stringify(nextProps.params)

  const filterReload = filterChangeNeedsReload(nextProps.filters, props.filters)

  return !(
  params === prevParams && !filterReload &&
  nextProps.location.search === props.location.search)
}

/**
 * Format unix timestamp to desired format
 * @param unix
 * @param format
 * @returns {*}
 */
export function formatUnixTimestamp(unix, format = 'MM/DD/YYYY') {
  return moment.unix(unix).isValid() ? moment.unix(unix).format(format) : formatDate(unix, format)
}

/**
 * Format unix timestamp to Date (moment)
 * @param unix
 * @param format
 * @returns {moment}
 */
export function unixTimestampToDate(unix) {
  return moment.unix(unix).utc().isValid() ? moment.unix(unix).utc() : undefined
}

/**
 * Format a date string to desired format
 * @param date
 * @param format
 * @returns {*}
 */
export function formatDate(date, format = 'MM/DD/YYYY') {
  return moment(date).format(format)
}


export function filterAccountsByUserName (accounts) {
  // placeholder for now
  return accounts
}

/**
 * Check if empty, check if custom error condition is true per field
 * @param {Object} fields
 * @param {Object} customConditions
 * returns {Object} errors
 */
export function checkForErrors(fields, customConditions, requiredTexts = {}) {
  let errors = {}

  for(const fieldName in fields) {
    const field = fields[fieldName]
    const isEmptyArray = field instanceof Array && field.length === 0
    if ((isEmptyArray || field === '' || field === undefined)) {
      errors[fieldName] = requiredTexts[fieldName] || 'Required'
    }
    else if (customConditions) {
      if(Array.isArray(customConditions[fieldName])) {
        for(const customCondition in customConditions[fieldName]) {
          if(customConditions[fieldName][customCondition] && customConditions[fieldName][customCondition].condition) {
            errors[fieldName] = customConditions[fieldName][customCondition].errorText
          }
        }
      }
      else if(customConditions[fieldName] && customConditions[fieldName].condition) {
        errors[fieldName] = customConditions[fieldName].errorText
      }
    }
  }
  return errors
}

export function formatFileSize(bytes) {
  return filesize(bytes)
}

export function getConfiguredName(host) {
  if(!host.size) {
    return null
  }
  if(host.getIn(['services',0,'deployment_mode']) === 'trial') {
    return host.getIn(['services',0,'configurations',0,'edge_configuration','trial_name'])
  }
  return host.getIn(['services',0,'configurations',0,'edge_configuration','published_name']) || null
}

export function getRolesForUser(user, roles) {
  let userRoles = []
  const mappedRoles = roles.size ?
    user.get('roles').map(roleId => (
      {
        id: roleId,
        name: roles.find(role => role.get('id') === roleId).get('name')
      }
    )).toJS()
    : []
  mappedRoles.forEach(role => {
    userRoles.push([role.id, role.name])
  })
  return userRoles
}

/**
 * Check if string matches Regular expression
 * @param string
 * @param pattern
 * @returns {boolean}
 */
export function matchesRegexp(string, pattern) {
  if(!(pattern instanceof RegExp)) {
    throw new Error(`${pattern} is not a valid RegExp string`);
  }
  var testPattern = new RegExp(pattern, 'i');
  return testPattern.test(string);
}

export function userIsServiceProvider(user) {
  return userHasRole(user, PROVIDER_TYPES.SERVICE_PROVIDER)
}

export function userIsContentProvider(user) {
  return userHasRole(user, PROVIDER_TYPES.CONTENT_PROVIDER)
}

export function userIsCloudProvider(user) {
  return userHasRole(user, PROVIDER_TYPES.CLOUD_PROVIDER)
}

export function userHasRole(user, roleToFind) {
  const userRoles = user.get('roles').toJS()
  const mapping = fromJS(ROLES_MAPPING)

  for (let roleId of userRoles) {
    const role = mapping.find(role => role.get('id') === roleId)
    const accountTypes = role.get('accountTypes')

    if (role && accountTypes && accountTypes.size > 0) {
      if (accountTypes.find(roleId => roleId === roleToFind)) {
        return true
      }
    }
  }

  return false
}

export function accountIsServiceProviderType(account) {
  return account.getIn(['provider_type']) === ACCOUNT_TYPE_SERVICE_PROVIDER
}

export function accountIsContentProviderType(account) {
  return account.getIn(['provider_type']) === ACCOUNT_TYPE_CONTENT_PROVIDER
}

export function accountIsCloudProviderType(account) {
  return account.getIn(['provider_type']) === ACCOUNT_TYPE_CLOUD_PROVIDER
}

export function getAccountByID(accounts, ids) {
  if (Array.isArray(ids)) {
    let accountsArray = []
    ids.map(id => {
      accountsArray.push(accounts.find(account => account.get('id') === id))
    })
    return accountsArray
  } else {
    return accounts.find(account => account.get('id') === ids)
  }
}

/**
 * Get sorted data for tables
 *
 * @param data
 * @param sortBy
 * @param sortDir
 * @param stateSortFunc
 * @returns {string}
 */
export function getSortData(data, sortBy, sortDir, stateSortFunc) {
  let sortFunc = ''
  if (stateSortFunc === 'specific' && sortBy.indexOf(',') > -1) {
    sortFunc = data.sort((a, b) => {
      sortBy = sortBy.toString().split(',')

      const lhs = a.get(sortBy[0])
      const rhs = b.get(sortBy[0])

      // the following conditionals handle cases where a & b contain null data
      if (!lhs && rhs) {
        return -1 * sortDir
      }
      if (lhs && !rhs) {
        return 1 * sortDir
      }
      if (lhs && rhs) {
        if (lhs.get(sortBy[1]) < rhs.get(sortBy[1])) {
          return -1 * sortDir
        } else if (lhs.get(sortBy[1]) > rhs.get(sortBy[1])) {
          return 1 * sortDir
        }
      }

      return 0
    })
  } else {
    sortFunc = data.sort((a, b) => {
      let aVal = a.get(sortBy)
      let bVal = b.get(sortBy)
      if(typeof a.get(sortBy) === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if(aVal < bVal) {
        return -1 * sortDir
      }
      else if(aVal > bVal) {
        return 1 * sortDir
      }
      return 0
    })
  }
  return sortFunc
}


/**
 * sort Immutable List by key
 * @param  {List} list
 * @param  {String} [key='name']
 * @param  {String} [direction='asc|desc']
 * @return {List} sorted list
 */
export const sortByKey = ( list, key = 'name', direction = 'asc') => {
  if (!list || list.isEmpty() ) return

  return list.sort(
      (a, b) => {
        const valA = a.get(key)
        const valB = b.get(key)
        if ( isNaN(valA) || isNaN(valB) ) {
          return (direction === 'asc')
            ? valA.toString().localeCompare(valB.toString())
            : - valA.toString().localeCompare(String(valB.toString()))
        }

        if (a > b && direction === 'asc') return 1
        if (a > b && direction === 'desc') return -1

        return 0
      }
  )
}


/**
 * Checks to see if a redux-form field has an error and returns "error". This
 * method is for use in determining the validationState of a FormGroup component
 * of the react-bootstrap library.
 * @param  {Field} field a redux-form Field object
 * @return {string} validationState for FormGroup component ("error", "warning", or "success")
 */
export function getReduxFormValidationState(field) {
  return (field.touched && field.error) ? "error" : null
}

/**
 * Aggregate data in 15-top-urls list to prevent repeating similar urls
 *
 * @param  {List} urlMetrics
 * @param  {string} dataKey
 * @return {List} topURLs
 */
export function getTopURLs(urlMetrics, dataKey) {
  const uniqueURLMetrics = urlMetrics.groupBy(metric => metric.get('url'))
  const byBytes = uniqueURLMetrics.map(urlArray => urlArray.reduce((prevVal, url) => (prevVal + url.get('bytes')), 0))
  const byRequests = uniqueURLMetrics.map(urlArray => urlArray.reduce((prevVal, url) => (prevVal + url.get('requests')), 0))

  let aggregatedByBytes = List()
  byBytes.map(url => {
    aggregatedByBytes = aggregatedByBytes.push({
      url: byBytes.keyOf(url),
      bytes: url
    })
  })

  let aggregatedByRequests = List([])
  byRequests.map(url => {
    aggregatedByRequests = aggregatedByRequests.push({
      url: byRequests.keyOf(url),
      requests: url
    })
  })
  const aggregatedData = dataKey === 'bytes' ?
    aggregatedByBytes.sortBy((metric) => -metric.bytes) :
    aggregatedByRequests.sortBy((metric) => -metric.requests)
  const topURLs = aggregatedData.filter((metric, i) => i < Math.min(aggregatedData.size, TOP_URLS_MAXIMUM_NUMBER))

  return topURLs
}

/**
 * Builds options for fetching data.
 * TODO: Refactor this so that we'll have one function for each option, e.g. buildByCityOpts
 * UDNP-2305 –– https://vidscale.atlassian.net/browse/UDNP-2305
 *
 * @method buildFetchOpts
 * @param  {Object}  coordinates              Object of map bounds
 * @param  {object}  params                   Object of values to match
 * @param  {object}  filters                  Filters to match, e.g. date range
 * @param  {string}  location                 [description]
 * @param  {string}  activeHostConfiguredName String of active host
 * @return {object}                           Object of different fetch options
 */
export function buildFetchOpts({ coordinates = {}, params = {}, filters = Map({}), location = {}, activeHostConfiguredName } = {}) {
  if (params.property && activeHostConfiguredName) {
    params = Object.assign({}, params, {
      property: activeHostConfiguredName
    })
  }

  const fetchOpts = location.pathname && buildAnalyticsOpts(params, filters, location)
  const startDate  = filters.getIn(['dateRange', 'startDate'])
  const endDate    = filters.getIn(['dateRange', 'endDate'])
  const rangeDiff  = startDate && endDate ? endDate.diff(startDate, 'month') : 0
  const byTimeOpts = Object.assign({
    granularity:  rangeDiff >= 2 ? 'day' : 'hour'
  }, fetchOpts || params)

  const dashboardStartDate  = Math.floor(startDate / 1000)
  const dashboardEndDate    = Math.floor(endDate / 1000)
  const dashboardOpts = Object.assign({
    startDate: dashboardStartDate,
    endDate: dashboardEndDate,
    granularity: rangeDiff >= 1 ? 'day' : 'hour'
  }, params)

  const byCityOpts = Object.assign({
    startDate: byTimeOpts.startDate || toUnixTimestamp(startDate),
    endDate: byTimeOpts.endDate || toUnixTimestamp(endDate),
    max_cities: MAPBOX_MAX_CITIES_FETCHED,
    latitude_south: coordinates.south || null,
    longitude_west: coordinates.west || null,
    latitude_north: coordinates.north || null,
    longitude_east: coordinates.east || null,
    show_detail: false
  }, byTimeOpts)

  return { byTimeOpts, fetchOpts, byCityOpts, dashboardOpts }
}

export function hasService(group, serviceID) {
  const services = group.get('services')
  return services && services.some(service => service.get('service_id') === serviceID)
}
