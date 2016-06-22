import numeral from 'numeral'
import Immutable from 'immutable'

export function formatBytes(bytes) {
  let formatted = numeral(bytes / 1000000000000000).format('0,0')+' PB'
  if(bytes < 1000) {
    formatted = numeral(bytes).format('0,0')+' B'
  }
  else if(bytes < 1000000) {
    formatted = numeral(bytes / 1000).format('0,0')+' KB'
  }
  else if(bytes < 1000000000) {
    formatted = numeral(bytes / 1000000).format('0,0')+' MB'
  }
  else if(bytes < 1000000000000) {
    formatted = numeral(bytes / 1000000000).format('0,0')+' GB'
  }
  else if(bytes < 1000000000000000) {
    formatted = numeral(bytes / 1000000000000).format('0,0')+' TB'
  }
  return formatted
}

export function formatBitsPerSecond(bits_per_second, decimals) {
  const digits = decimals ? '0,0.00' : '0,0'
  let formatted = numeral(bits_per_second / 1000000000000000).format(digits)+' Pbps'
  if(bits_per_second < 1000) {
    formatted = numeral(bits_per_second).format(digits)+' bps'
  }
  else if(bits_per_second < 1000000) {
    formatted = numeral(bits_per_second / 1000).format(digits)+' Kbps'
  }
  else if(bits_per_second < 1000000000) {
    formatted = numeral(bits_per_second / 1000000).format(digits)+' Mbps'
  }
  else if(bits_per_second < 1000000000000) {
    formatted = numeral(bits_per_second / 1000000000).format(digits)+' Gbps'
  }
  else if(bits_per_second < 1000000000000000) {
    formatted = numeral(bits_per_second / 1000000000000).format(digits)+' Tbps'
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
    if (account.id < 10000) {
      return username === 'UDNdev'
    }
    else if (account.id < 20000) {
      return username === 'UDNtest'
    }
    else {
      return username === 'UDNprod' || username === 'UDNstag' || username === 'diomedes'
    }
  }));
}

export function filterMetricsByAccounts(metrics, accounts){
  return metrics.filter( (metric) => {
    return accounts.find( (account) => {
      return account.get('id') === metric.get('account')
    });
  });
}

export function matchesRegexp(string, pattern){
  if(!(pattern instanceof RegExp)){
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

  for (const property in object) {
    if (object.hasOwnProperty(property) && remove.indexOf(property) === -1) {
      result[property] = object[property];
    }
  }

  return result
}

/* REFACTOR: this is a quick fix to get tab links from current path
 - takes the last link part out and replaces it with tabName
 */
export function getTabLink( path, tabName){
  let linkArr = path.split('/')

  linkArr.pop()
  linkArr.push(tabName)

  return linkArr.join('/')

}
/* A helper for returning tabName / url from path - NOT 100% accurate */
export function getTabName( path ){
  let linkArr = path.split('/')
  return linkArr.pop()
}

/* Constructs nested link from linkParts -array */
export function generateNestedLink( base, linkParts ){
  //remove nulls
  linkParts = linkParts.filter( (e) => {
    return e
  })

  return base + '/' + linkParts.join("/")
}
