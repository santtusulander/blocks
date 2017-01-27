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

  const splitAddr = !!address && address.split(/\/([0-9]+)(?=[^\/]*$)/)

  if(splitAddr.length > 1) {
    return validator.isIP(splitAddr[0], 4) && ( parseInt(splitAddr[1]) < 32 )
  }

  return !!address && validator.isIP(address, 4)
}

/**
 * Check if valid IPv6 address
 * @param address
 * @returns {*}
 */
export function isValidIPv6Address(address) {

  const splitAddr = !!address && address.split(/\/([0-9]+)(?=[^\/]*$)/)

  if(splitAddr.length > 1) {
    return validator.isIP(splitAddr[0], 6) && ( parseInt(splitAddr[1]) < 32 )
  }

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
 * Check if valid text-field
 * @param text
 * @returns {boolean}
 */
export function isValidTextField(text) {
  const textFieldRegexp = new RegExp('^[a-zA-Z0-9_ \\.,\\-\\&\\(\\)\[\\]]{3,40}$')
  return text && textFieldRegexp.test(text) && !isOnlyWhiteSpace(text)
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
  return !isNaN(int) &&
         parseInt(Number(int)) == int &&
         !isNaN(parseInt(int, 10));
}

/**
 * Check if is valid base64-encoded string (example: c2hhcmVkLXNlY3JldA==)
 * RegEx sourced from http://stackoverflow.com/a/475217/2715
 * @returns {*}
 * @param str
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
