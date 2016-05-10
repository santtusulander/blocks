export const urlBase = ''
export const topoBase = 'http://localhost:3000/assets/topo'
export const analyticsBase = 'http://localhost:3000/analytics'

export const parseResponseData = response => response ? response.data : null

export function mapReducers(next, err) {
  if(!next || !err) {
    throw Error('Expects next and throw functions.')
  }
  return {next, throw: err}
}

export function qsBuilder({
  account,
  group,
  property,
  startDate,
  endDate,
  granularity,
  aggregate_granularity,
  max_countries
}) {
  let qs = []
  if(account) {
    qs.push(`account=${account}`)
  }
  if(group) {
    qs.push(`group=${group}`)
  }
  if(property) {
    qs.push(`property=${property}`)
  }
  if(startDate) {
    qs.push(`start=${startDate}`)
  }
  if(endDate) {
    qs.push(`end=${endDate}`)
  }
  if(granularity) {
    qs.push(`granularity=${granularity}`)
  }
  if(aggregate_granularity) {
    qs.push(`aggregate_granularity=${aggregate_granularity}`)
  }
  if(max_countries) {
    qs.push(`max_countries=${max_countries}`)
  }
  return qs.length ? '?'+qs.join('&') : ''
}
