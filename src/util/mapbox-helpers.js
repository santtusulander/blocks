import { buildAnalyticsOpts } from './helpers'

import { MAPBOX_MAX_CITIES_FETCHED } from '../constants/mapbox'

export function buildOpts({ coordinates = {}, params = {}, filters = {}, location = {}, activeHostConfiguredName } = {}) {
  if (params.property && activeHostConfiguredName) {
    params = Object.assign({}, params, {
      property: activeHostConfiguredName
    })
  }

  const fetchOpts = buildAnalyticsOpts(params, filters, location)
  const startDate  = filters.getIn(['dateRange', 'startDate'])
  const endDate    = filters.getIn(['dateRange', 'endDate'])
  const rangeDiff  = startDate && endDate ? endDate.diff(startDate, 'month') : 0
  const byTimeOpts = Object.assign({
    granularity: rangeDiff >= 2 ? 'day' : 'hour'
  }, fetchOpts)

  const byCityOpts = Object.assign({
    max_cities: MAPBOX_MAX_CITIES_FETCHED,
    latitude_south: coordinates.south || null,
    longitude_west: coordinates.west || null,
    latitude_north: coordinates.north || null,
    longitude_east: coordinates.east || null
  }, byTimeOpts)

  return { byTimeOpts, fetchOpts, byCityOpts }
}

export function getCitiesWithinBounds({ params, filters, location, coordinates, activeHostConfiguredName, actions } = {}) {
  const { byCityOpts } = buildOpts({
    params,
    filters,
    location,
    coordinates,
    activeHostConfiguredName
  })

  actions.startFetching()
  actions.fetchByCity(byCityOpts).then(
    actions.finishFetching()
  )
}
