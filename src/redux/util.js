export const urlBase = ''

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
