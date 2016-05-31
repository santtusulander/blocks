import numeral from 'numeral'

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

export function formatBitsPerSecond(bits_per_second) {
  let formatted = numeral(bits_per_second / 1000000000000000).format('0,0')+' Pbps'
  if(bits_per_second < 1000) {
    formatted = numeral(bits_per_second).format('0,0')+' bps'
  }
  else if(bits_per_second < 1000000) {
    formatted = numeral(bits_per_second / 1000).format('0,0')+' Kbps'
  }
  else if(bits_per_second < 1000000000) {
    formatted = numeral(bits_per_second / 1000000).format('0,0')+' Mbps'
  }
  else if(bits_per_second < 1000000000000) {
    formatted = numeral(bits_per_second / 1000000000).format('0,0')+' Gbps'
  }
  else if(bits_per_second < 1000000000000000) {
    formatted = numeral(bits_per_second / 1000000000000).format('0,0')+' Tbps'
  }
  return formatted
}

export function filterAccountsByUserName(accounts, username) {
  if(username === 'test') {
    return accounts
  }
  return accounts.filter(account => {
    if(account.get('id') < 10000) {
      return username === 'UDNdev'
    }
    else if(account.get('id') < 20000) {
      return username === 'UDNtest'
    }
    else {
      return username === 'UDNprod' || username === 'UDNstag' || username === 'diomedes'
    }
  })
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
