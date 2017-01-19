import validator from 'validator'
import { matchesRegexp } from './helpers'

/**
 * Global validators
 * @see https://github.com/chriso/validator.js#validators
 */

/**
 * Check if valid email
 * @param email
 * @returns {*}
 */
export function isValidEmail(email) {
  return !!email && validator.isEmail(email)
}

/**
 * Check if valid IPv4 address
 * @param address
 * @returns {*}
 */
export function isValidIPv4Address(address) {
  return !!address && validator.isIP(address, 4)
}

/**
 * Check if valid IPv4 address and valid subnet
 * @param address
 * @returns {*}
 */
export function isValidIPv4AddressWithSubnet(address) {
  if(!address) {
    return false;
  }

  const splitadd = address.split(/\/([0-9]+)(?=[^\/]*$)/)

  if(splitadd) {
    return validator.isIP(splitadd[0], 4) && ( parseInt(splitadd[1]) < 32 )  // TODO: add proper IPv4 and IPv6 validator
  }

  return false;
}

/**
 * Check if valid IPv6 address
 * @param address
 * @returns {*}
 */
export function isValidIPv6Address(address) {
  return !!address && validator.isIP(address, 6)
}

/**
 * Check if valid nameServer
 * @param nameServer
 * @returns {boolean}
 */
export function isValidNameserver(nameServer) {
  return matchesRegexp(nameServer, /^([a-zA-Z0-9*]([a-zA-Z0-9-*]*[a-zA-Z0-9*]+)?\.)+$/)
}

/**
 * Check if valid SOA-record
 * @param record
 * @returns {boolean}
 */
export function isValidSOARecord(record) {
  return matchesRegexp(record, /^(([-a-z0-9~!$%^&*_=+}{.\'?]*)\.)$/)
}

/**
 * Check if valid domain-name
 * @param domainName
 * @param opts
 * @returns {boolean|*}
 */
export function isValidFQDN(domainName, opts = {}) {
  return !!domainName && validator.isFQDN(domainName, opts)
}

/**
 * Check if valid URL (absolute path)
 * @credit http://stackoverflow.com/a/31431911/2715
 * @param url
 * @returns {boolean|*}
 */
export function isValidURL(url) {
  return matchesRegexp(url, /^([a-z0-9]*:|.{0})\/\/.*$/)
}

/**
 * Check if valid relative path
 * @credit http://stackoverflow.com/a/31431911/2715
 * @param path
 * @returns {boolean|*}
 */
export function isValidRelativePath(path) {
  return matchesRegexp(path, /^[^\/]+\/[^\/].*$|^\/[^\/].*$/)
}

/**
 * Check if valid host-name
 * @param hostName
 * @param opts
 * @returns {boolean|*}
 */
export function isValidHostName(hostName) {
  /* Rules matching CloudScale's Hostname validation:
    - isn't longer than 255 characters.
    Each segment:
    - contains at least one character and a maximum of 63 characters;
    - consists only of allowed characters [a-zA-Z0-9-];
    - doesn't begin or end with a hyphen;
    - can end with a dot.
  */
  if (hostName.length > 255) return false
  return matchesRegexp(hostName, /^[a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[a-z\d])?)*[.]?$/)
}

/**
 * Check if valid account-name
 * @param name
 * @returns {boolean}
 */
export function isValidAccountName(name) {
  const accountNameRegexp = new RegExp('^[a-zA-Z0-9_ \\.,\\-\\&\\(\\)\[\\]]{3,40}$')
  return name && accountNameRegexp.test(name) && !isOnlyWhiteSpace(name)
}

/**
 * Check if string only contains whitespace
 * @param val
 * @returns {boolean}
 */
export function isOnlyWhiteSpace(val) {
  return /^\s+$/.test(val)
}

/**
 * Check if string is in range
 * @param str
 * @param length
 * @returns {*}
 */
export function isInLength(str, length = 10) {
  return !!str && validator.isLength(str, { min: 1, max: length })
}

/**
 * Check if Integer
 * @param int
 * @returns {*}
 */
export function isInt(int) {
  return !!int && !isNaN(int)
}

/**
 * Check if is valid base64-encoded string (example: c2hhcmVkLXNlY3JldA==)
 * RegEx sourced from http://stackoverflow.com/a/475217/2715
 * @param string
 * @returns {*}
 */
export function isBase64(str) {
  return !!str && matchesRegexp(str, /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/)
}

/**
 * Check if current browser is Safari
 * @returns {boolean}
 */
export function isSafari() {
  return matchesRegexp(navigator.userAgent, /^((?!chrome|android).)*safari/)
}

/**
 * Check if valid phone number
 * @param  {[type]}  str [description]
 * @return {Boolean}
 */
export function isValidPhoneNumber(str) {
  return matchesRegexp(str, /^(|\d{7,})$/)
}

/**
 * Check if valid country code (in phoneNumber)
 * @param  {[type]}  str [description]
 * @return {Boolean}
 */
export function isValidCountryCode(str) {
  return matchesRegexp(str, /^(|\d{1,7})$/)
}
