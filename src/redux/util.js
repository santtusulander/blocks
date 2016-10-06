import moment from 'moment'

// For authentication, account, group, user, role, permission management
export const BASE_URL_AAA = '/v2'

// For Content/Serivce Provider management and configuration
export const BASE_URL_NORTH = '/VCDN/v2'

export const topoBase = () => {
  switch(process.env.NODE_ENV) {
    case 'development':
      return TOPO_BASE_URI_DEVELOPMENT
    case 'production':
      return TOPO_BASE_URI_PRODUCTION
    default:
      return TOPO_BASE_URI_DEVELOPMENT
  }
}

export const analyticsBase = () => {
  switch(process.env.NODE_ENV) {
    case 'development':
      return ANALYTICS_BASE_URI_DEVELOPMENT
    case 'production':
      return ANALYTICS_BASE_URI_PRODUCTION
    default:
      return ANALYTICS_BASE_URI_DEVELOPMENT
  }
}

export const parseResponseData = response => response ? response.data : null

export function mapReducers(next, err) {
  if(!next || !err) {
    throw Error('Expects next and throw functions.')
  }
  return {next, throw: err}
}

export function qsBuilder(params) {
  const qs = Object.keys(params).reduce((arr, key) => {

    //remove undefined values
    if (params[key] === undefined) return arr

    let param = key

    if(key === 'startDate') {
      param = 'start'
    }
    else if (key === 'endDate') {
      param = 'end'
    }
    return [...arr, `${param}=${params[key]}`]
  }, [])
  return qs.length ? '?'+qs.join('&') : ''
}

export function getDateRange( filters ) {
  const endDate = filters.getIn(['dateRange', 'endDate']) || moment().utc().endOf('day')
  const startDate = filters.getIn(['dateRange', 'startDate']) || moment().utc().startOf('month')

  return {
    startDate,
    endDate
  }
}
