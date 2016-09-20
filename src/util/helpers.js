import moment from 'moment'
import numeral from 'numeral'
import { getDateRange } from '../redux/util.js'
import { filterNeedsReload } from '../constants/filters.js'
import filesize from 'filesize'
import { Address4, Address6 } from 'ip-address'

const BYTE_BASE = 1000

export function formatBytes(bytes, setMax) {
  let formatted = numeral(bytes / Math.pow(BYTE_BASE, 5)).format('0,0') + ' PB'
  bytes         = bytes || 0

  if((setMax || bytes) < BYTE_BASE) {
    formatted = numeral(bytes).format('0,0') + ' B'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 2)) {
    formatted = numeral(bytes / BYTE_BASE).format('0,0') + ' KB'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 3)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 2)).format('0,0') + ' MB'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 4)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 3)).format('0,0') + ' GB'
  }
  else if((setMax || bytes) < Math.pow(BYTE_BASE, 5)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 4)).format('0,0') + ' TB'
  }
  return formatted
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

export function filterMetricsByAccounts(metrics, accounts) {
  return metrics.filter((metric) => {
    return accounts.find((account) => {
      return account.get('id') === metric.get('account')
    });
  });
}

export function matchesRegexp(string, pattern) {
  if(!(pattern instanceof RegExp)) {
    throw new Error(`${pattern} is not a valid RegExp string`);
  }
  var testPattern = new RegExp(pattern, 'i');
  return testPattern.test(string);
}

export function isSafari() {
  return matchesRegexp(navigator.userAgent, /^((?!chrome|android).)*safari/)
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

export function buildAnalyticsOpts(params, filters){
  const {startDate, endDate} = getDateRange(filters)
  const serviceType = filters.get('serviceTypes').size > 1 ? undefined : filters.get('serviceTypes').toJS()

  return {
    account: params.account,
    brand: params.brand,
    group: params.group,
    property: params.property,
    startDate: startDate.format('X'),
    endDate: endDate.format('X'),
    service_type: serviceType
  }
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
  return moment.unix(unix).isValid() ? moment.unix(unix).format(format) : unix
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
export function checkForErrors(fields, customConditions) {
  let errors = {}
  for(const fieldName in fields) {
    const field = fields[fieldName]
    const isEmptyArray = field instanceof Array && field.length === 0
    if(isEmptyArray || field === '') {
      errors[fieldName] = 'Required'
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

export function isValidIPv4Address(address) {
  if (!address) {
    return false
  }
  return new Address4(address).isValid()
}

export function isValidIPv6Address(address) {
  if (!address) {
    return false
  }
  return new Address6(address).isValid()
}
