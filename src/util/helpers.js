import moment from 'moment'
import numeral from 'numeral'
import Immutable from 'immutable'
import { getRoute } from '../routes.jsx'
import { getDateRange } from '../redux/util.js'
import { filterNeedsReload } from '../constants/filters.js'

const BYTE_BASE = 1000

export function formatBytes(bytes) {
  let formatted = numeral(bytes / Math.pow(BYTE_BASE, 5)).format('0,0') + ' PB'
  bytes         = bytes || 0

  if(bytes < BYTE_BASE) {
    formatted = numeral(bytes).format('0,0') + ' B'
  }
  else if(bytes < Math.pow(BYTE_BASE, 2)) {
    formatted = numeral(bytes / BYTE_BASE).format('0,0') + ' KB'
  }
  else if(bytes < Math.pow(BYTE_BASE, 3)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 2)).format('0,0') + ' MB'
  }
  else if(bytes < Math.pow(BYTE_BASE, 4)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 3)).format('0,0') + ' GB'
  }
  else if(bytes < Math.pow(BYTE_BASE, 5)) {
    formatted = numeral(bytes / Math.pow(BYTE_BASE, 4)).format('0,0') + ' TB'
  }
  return formatted
}

export function formatBitsPerSecond(bits_per_second, decimals) {
  const digits    = decimals ? '0,0.00' : '0,0'
  bits_per_second = bits_per_second || 0
  let formatted   = numeral(bits_per_second / Math.pow(BYTE_BASE, 5)).format(digits) + ' Pbps'

  if(bits_per_second < BYTE_BASE) {
    formatted = numeral(bits_per_second).format(digits) + ' bps'
  }
  else if(bits_per_second < Math.pow(BYTE_BASE, 2)) {
    formatted = numeral(bits_per_second / BYTE_BASE).format(digits) + ' Kbps'
  }
  else if(bits_per_second < Math.pow(BYTE_BASE, 3)) {
    formatted = numeral(bits_per_second / Math.pow(BYTE_BASE, 2)).format(digits) + ' Mbps'
  }
  else if(bits_per_second < Math.pow(BYTE_BASE, 4)) {
    formatted = numeral(bits_per_second / Math.pow(BYTE_BASE, 3)).format(digits) + ' Gbps'
  }
  else if(bits_per_second < Math.pow(BYTE_BASE, 5)) {
    formatted = numeral(bits_per_second / Math.pow(BYTE_BASE, 4)).format(digits) + ' Tbps'
  }
  return formatted
}

export function filterAccountsByUserName(accounts, username) {
  if(username === 'test') {
    return accounts

    //UNCOMMENT FOR TESTing -- return only limited accounts
    /*return Immutable.fromJS(accounts.toJS().filter( (account) => {
     return account.id === 4 || account.id === 1
     }))*/
  }

  return Immutable.fromJS(accounts.toJS().filter(account => {
    if(account.id < 10000) {
      return username === 'UDNdev'
    }
    else if(account.id < 20000) {
      return username === 'UDNtest'
    }
    else {
      return username === 'UDNprod' || username === 'UDNstag' || username === 'diomedes'
    }
  }));
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

export function getUrl(baseUrl, linkType, val, params) {
  const { brand, account, group } = params;

  let url
  switch(linkType) {
    case 'brand':
      url = `${baseUrl}/${val}`
      break;
    case 'account':
      url = `${baseUrl}/${brand}/${val}`
      break;
    case 'group':
      url = `${baseUrl}/${brand}/${account}/${val}`
      break;
    case 'property':
      url = `${baseUrl}/${brand}/${account}/${group}/${val}`
      break;
  }

  return url
}

export function getAnalyticsUrl(linkType, val, params) {
  const { brand, account, group } = params,
    baseUrl = getRoute('analytics')

  let url
  switch(linkType) {
    case 'brand':
      url = `${baseUrl}/${val}`
      break;
    case 'account':
      url = `${baseUrl}/${brand}/${val}`
      break;
    case 'group':
      url = `${baseUrl}/${brand}/${account}/${val}`
      break;
    case 'property':
      url = `${baseUrl}/${brand}/${account}/${group}/${val}`
      break;
  }

  return url
}

export function getContentUrl(linkType, val, params) {
  const { brand, account, group } = params,
    baseUrl = getRoute('content')

  let url
  switch(linkType) {
    case 'brand':
      url = `${baseUrl}/${val}`
      break;
    case 'account':
      url = `${baseUrl}/${brand}/${val}`
      break;
    case 'group':
      url = `${baseUrl}/${brand}/${account}/${val}`
      break;
    case 'property':
      url = `${baseUrl}/${brand}/${account}/${group}/${val}`
      break;
    case 'propertyAnalytics':
      url = `${baseUrl}/${brand}/${account}/${group}/${val}/analytics`
      break;
    case 'propertyConfiguration':
      url = `${baseUrl}/${brand}/${account}/${group}/${val}/configuration`
      break;
  }

  return url
}

export function getAnalyticsUrlFromParams(params) {
  const { brand, account, group, property } = params,
    baseUrl = getRoute('analytics')

  if (property) {
    return `${baseUrl}/${brand}/${account}/${group}/${property}`
  } else if (group) {
    return `${baseUrl}/${brand}/${account}/${group}`
  } else if (account) {
    return `${baseUrl}/${brand}/${account}`
  } else if (brand) {
    return `${baseUrl}/${brand}`
  } else {
    return `${baseUrl}/udn`
  }
}

export function getContentUrlFromParams(params) {
  const { brand, account, group, property } = params,
    baseUrl = getRoute('content')

  if (property) {
    return `${baseUrl}/${brand}/${account}/${group}/${property}`
  } else if (group) {
    return `${baseUrl}/${brand}/${account}/${group}`
  } else if (account) {
    return `${baseUrl}/${brand}/${account}`
  } else if (brand) {
    return `${baseUrl}/${brand}`
  } else {
    return `${baseUrl}/udn`
  }
}

export function getAccountManagementUrlFromParams(params) {
  const { brand, account } = params

  if (account) {
    return getRoute('accountManagementAccount', params)
  } else if (brand) {
    return getRoute('accountManagementBrand', params)
  } else {
    return getRoute('accountManagementBrand', { brand: 'udn' })
  }
}

export function getServicesUrlFromParams(params) {
  const { brand, account } = params

  if (account) {
    return getRoute('servicesAccount', params)
  } else if (brand) {
    return getRoute('servicesBrand', params)
  } else {
    return getRoute('servicesBrand', { brand: 'udn' })
  }
}

export function getSupportUrlFromParams(params) {
  const { brand, account } = params

  if (account) {
    return getRoute('supportAccount', params)
  } else if (brand) {
    return getRoute('supportBrand', params)
  } else {
    return getRoute('supportBrand', { brand: 'udn' })
  }
}

export function getSecurityUrlFromParams(params) {
  const { brand, account } = params

  if (account) {
    return getRoute('securityAccount', params)
  } else if (brand) {
    return getRoute('securityBrand', params)
  } else {
    return getRoute('securityBrand', { brand: 'udn' })
  }
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
