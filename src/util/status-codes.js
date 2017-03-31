import React from 'react'
import { FormattedMessage } from 'react-intl'
import { matchesRegexp } from './helpers'

/**
 * HTTP responses
 * @type []
 */
export const HTTP_RESPONSES = [
  // { code: 100, message: <FormattedMessage id="portal.common.statusCode.100"/> },
  // { code: 101, message: <FormattedMessage id="portal.common.statusCode.101"/> },
  // { code: 102, message: <FormattedMessage id="portal.common.statusCode.102"/> },

  { code: 200, message: <FormattedMessage id="portal.common.statusCode.200"/> },
  { code: 201, message: <FormattedMessage id="portal.common.statusCode.201"/> },
  { code: 202, message: <FormattedMessage id="portal.common.statusCode.202"/> },
  { code: 203, message: <FormattedMessage id="portal.common.statusCode.203"/> },
  { code: 204, message: <FormattedMessage id="portal.common.statusCode.204"/> },

  // { code: 205, message: <FormattedMessage id="portal.common.statusCode.205"/> },
  // { code: 206, message: <FormattedMessage id="portal.common.statusCode.206"/> },
  // { code: 207, message: <FormattedMessage id="portal.common.statusCode.207"/> },
  // { code: 208, message: <FormattedMessage id="portal.common.statusCode.208"/> },
  // { code: 226, message: <FormattedMessage id="portal.common.statusCode.226"/> },

  // { code: 300, message: <FormattedMessage id="portal.common.statusCode.300"/> },
  { code: 301, message: <FormattedMessage id="portal.common.statusCode.301"/> },
  { code: 302, message: <FormattedMessage id="portal.common.statusCode.302"/> },
  // { code: 303, message: <FormattedMessage id="portal.common.statusCode.303"/> },
  // { code: 304, message: <FormattedMessage id="portal.common.statusCode.304"/> },
  // { code: 305, message: <FormattedMessage id="portal.common.statusCode.305"/> },
  { code: 307, message: <FormattedMessage id="portal.common.statusCode.307"/> },
  // { code: 308, message: <FormattedMessage id="portal.common.statusCode.308"/> },

  { code: 400, message: <FormattedMessage id="portal.common.statusCode.400"/> },
  { code: 401, message: <FormattedMessage id="portal.common.statusCode.401"/> },
  { code: 402, message: <FormattedMessage id="portal.common.statusCode.402"/> },
  { code: 403, message: <FormattedMessage id="portal.common.statusCode.403"/> },
  { code: 404, message: <FormattedMessage id="portal.common.statusCode.404"/> },
  { code: 405, message: <FormattedMessage id="portal.common.statusCode.405"/> },

  // { code: 406, message: <FormattedMessage id="portal.common.statusCode.406"/> },
  // { code: 407, message: <FormattedMessage id="portal.common.statusCode.407"/> },
  // { code: 408, message: <FormattedMessage id="portal.common.statusCode.408"/> },
  // { code: 409, message: <FormattedMessage id="portal.common.statusCode.409"/> },
  // { code: 410, message: <FormattedMessage id="portal.common.statusCode.410"/> },

  { code: 411, message: <FormattedMessage id="portal.common.statusCode.411"/> },
  { code: 412, message: <FormattedMessage id="portal.common.statusCode.412"/> },
  { code: 413, message: <FormattedMessage id="portal.common.statusCode.413"/> },

  // { code: 414, message: <FormattedMessage id="portal.common.statusCode.414"/> },
  // { code: 415, message: <FormattedMessage id="portal.common.statusCode.415"/> },
  // { code: 416, message: <FormattedMessage id="portal.common.statusCode.416"/> },
  // { code: 417, message: <FormattedMessage id="portal.common.statusCode.417"/> },
  // { code: 418, message: <FormattedMessage id="portal.common.statusCode.418"/> },
  // { code: 421, message: <FormattedMessage id="portal.common.statusCode.421"/> },
  // { code: 422, message: <FormattedMessage id="portal.common.statusCode.422"/> },
  // { code: 423, message: <FormattedMessage id="portal.common.statusCode.423"/> },
  // { code: 424, message: <FormattedMessage id="portal.common.statusCode.424"/> },
  // { code: 425, message: <FormattedMessage id="portal.common.statusCode.425"/> },
  // { code: 426, message: <FormattedMessage id="portal.common.statusCode.426"/> },
  // { code: 428, message: <FormattedMessage id="portal.common.statusCode.427"/> },
  // { code: 429, message: <FormattedMessage id="portal.common.statusCode.429"/> },
  // { code: 431, message: <FormattedMessage id="portal.common.statusCode.431"/> },
  // { code: 451, message: <FormattedMessage id="portal.common.statusCode.451"/> },

  { code: 500, message: <FormattedMessage id="portal.common.statusCode.500"/> },
  { code: 501, message: <FormattedMessage id="portal.common.statusCode.501"/> },
  { code: 502, message: <FormattedMessage id="portal.common.statusCode.502"/> },
  { code: 503, message: <FormattedMessage id="portal.common.statusCode.503"/> }

  // { code: 504, message: <FormattedMessage id="portal.common.statusCode.504"/> },
  // { code: 505, message: <FormattedMessage id="portal.common.statusCode.505"/> },
  // { code: 506, message: <FormattedMessage id="portal.common.statusCode.506"/> },
  // { code: 507, message: <FormattedMessage id="portal.common.statusCode.507"/> },
  // { code: 508, message: <FormattedMessage id="portal.common.statusCode.508"/> },
  // { code: 510, message: <FormattedMessage id="portal.common.statusCode.510"/> },
  // { code: 511, message: <FormattedMessage id="portal.common.statusCode.511"/> }
]

/**
 * Extract only the numerical code from full responses
 * @param responses
 * @returns {*}
 */
function extractNumericalCodes(responses) {
  return responses.map(response => response.code)
}

/**
 * Pick responses
 * @param responseCodes
 * @param onlyCodes
 * @returns {Array.<*>}
 */
export function getPickedResponseCodes(responseCodes = [], onlyCodes = true) {
  const pickedResponses = HTTP_RESPONSES.filter(response => responseCodes.includes(response.code))
  return onlyCodes ? extractNumericalCodes(pickedResponses) : pickedResponses
}


/**
 * Get error responses
 * @param onlyCodes
 * @returns {Array.<*>|Iterable<K, V>}
 */
export function getErrorResponseCodes(onlyCodes = true) {
  const errorResponses = HTTP_RESPONSES.filter(response => matchesRegexp(response.code, /([4,5]).\d/))
  return onlyCodes ? extractNumericalCodes(errorResponses) : errorResponses
}

/**
 * Get analysis error codes (used in File-error report)
 * @param onlyCodes
 * @returns {Array.<*>}
 */
export function getAnalysisErrorCodes(onlyCodes = true) {
  const errorCodes = [400, 401, 402, 403, 404, 405, 411, 412, 413, 500, 501, 502, 503]
  return getPickedResponseCodes(errorCodes, onlyCodes)
}

/**
 * Get analysis status codes (used in URL report)
 * @param onlyCodes
 * @returns {Array.<*>}
 */
export function getAnalysisStatusCodes(onlyCodes = true) {
  const statusCodes = [200, 201, 202, 204, 400, 401, 402, 403, 404, 405, 411, 412, 413, 500, 501, 502, 503]
  return getPickedResponseCodes(statusCodes, onlyCodes)
}

/**
 * Get all responses
 * @param onlyCodes
 * @returns {*[]}
 */
export function getResponseCodes(onlyCodes = true) {
  return onlyCodes ? extractNumericalCodes(HTTP_RESPONSES) : HTTP_RESPONSES
}
