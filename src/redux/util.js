import moment from 'moment'
import { endOfThisDay, startOfThisMonth, startOfThisDay } from '../constants/date-ranges'

// CIS
export const BASE_URL_CIS_SOUTH = '/cis_south'
export const BASE_URL_CIS_NORTH = '/cis_north'


// For authentication, account, group, user, role, permission management
export const BASE_URL_AAA = '/v2'

// For Content/Serivce Provider management and configuration
export const BASE_URL_NORTH = '/VCDN/v2'

export const PAGINATION_MOCK = {
  params: {
    page_size: -1
  }
}

export const topoBase = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return TOPO_BASE_URI_DEVELOPMENT
    case 'production':
      return TOPO_BASE_URI_PRODUCTION
    default:
      return TOPO_BASE_URI_DEVELOPMENT
  }
}

export const analyticsBase = ({legacy = true} = {}) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return legacy ? ANALYTICS_BASE_URI_DEVELOPMENT_LEGACY : ANALYTICS_BASE_URI_DEVELOPMENT
    case 'production':
      return legacy ? ANALYTICS_BASE_URI_PRODUCTION + '-legacy' : ANALYTICS_BASE_URI_PRODUCTION
    default:
      return ANALYTICS_BASE_URI_DEVELOPMENT
  }
}

export const parseResponseData = (response) => {
  return response ? response.data : null
}

export function mapReducers(next, err) {
  if (!next || !err) {
    throw Error('Expects next and throw functions.')
  }
  return {next, throw: err}
}

export function qsBuilder(params) {
  const qs = Object.keys(params).reduce((arr, key) => {

    //remove undefined values
    if (params[key] === undefined) {
      return arr
    }

    let param = key

    if (key === 'startDate') {
      param = 'start'
    } else if (key === 'endDate') {
      param = 'end'
    }
    return [...arr, `${param}=${params[key]}`]
  }, [])
  return qs.length ? '?'+qs.join('&') : ''
}

export function getDateRange(filters) {
  const endDate = filters.getIn(['dateRange', 'endDate']) || endOfThisDay()
  const startDate = filters.getIn(['dateRange', 'startDate']) || startOfThisMonth()

  return {
    startDate,
    endDate
  }
}

export function getCustomDateRange(filters) {
  const endDate = filters.getIn(['customDateRange', 'endDate']) || endOfThisDay()
  const startDate = filters.getIn(['customDateRange', 'startDate']) || startOfThisDay()

  return {
    startDate,
    endDate
  }
}

export const buildReduxId = (...ids) => {
  return ids.reduce((reduxId, parentId, index) => {

    if (index === ids.length - 1) {
      return reduxId.concat(parentId)
    }

    return reduxId.concat(parentId + '-')
  }, '')
}

/**
 * Get error message form failed axios response
 * @param {Error} error - axios error
 * @return {*}
 */
export const parseResponseError = (error) => {
  const { response, message } = error

  return  response ? response.data.message : message
}
