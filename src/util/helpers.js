import numeral from 'numeral'
import Immutable from 'immutable'
import { getRoute } from '../routes.jsx'
import { getDateRange } from '../redux/util.js'
import { filterNeedsReload } from '../constants/filters.js'

const BYTE_BASE = 1024

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

export function getAnalyticsUrl(linkType, val, params) {
  const { brand, account, group } = params
  let url

  switch(linkType) {
    case 'brand':
      url = `${getRoute('analytics')}/${val}`
      break;
    case 'account':
      url = `${getRoute('analytics')}/${brand}/${val}`
      break;
    case 'group':
      url = `${getRoute('analytics')}/${brand}/${account}/${val}`
      break;
    case 'property':
      url = `${getRoute('analytics')}/${brand}/${account}/${group}/property?property=${val}`
      break;
  }

  return url

}

export function buildAnalyticsOpts(params, filters, location) {
  const { startDate, endDate } = getDateRange(filters)
  return {
    account: params.account,
    brand: params.brand,
    group: params.group,
    property: location.query.property,
    startDate: startDate.format('X'),
    endDate: endDate.format('X')
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
