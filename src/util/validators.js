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
export function isEmail(email) {
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
 * Check if valid IPv6 address
 * @param address
 * @returns {*}
 */
export function isValidIPv6Address(address) {
  return !!address && validator.isIP(address, 6)
}

/**
 * Check if string is in range
 * @param str
 * @param opts
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
export function isFQDN(domainName, opts = {}) {
  return !!domainName && validator.isFQDN(domainName, opts)
}

/**
 * Check if valid account-name
 * @param name
 * @returns {boolean}
 */
export function isValidAccountName(name) {
  return matchesRegexp(name, /^[a-zA-Z0-9_ \\.,\\-\\&\\(\\)\[\\]]{3,40}$/)
}

/**
 * Check if current browser is Safari
 * @returns {boolean}
 */
export function isSafari() {
  return matchesRegexp(navigator.userAgent, /^((?!chrome|android).)*safari/)
}

