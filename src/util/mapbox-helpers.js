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
  const aggregateGranularity = byTimeOpts.granularity

  const byCityOpts = Object.assign({
    max_cities: MAPBOX_MAX_CITIES_FETCHED,
    latitude_south: coordinates.south || null,
    longitude_west: coordinates.west || null,
    latitude_north: coordinates.north || null,
    longitude_east: coordinates.east || null,
    show_detail: false
  }, byTimeOpts)

  const dashboardOpts = Object.assign({
    startDate,
    endDate,
    granularity: 'hour'
  }, params)

  return { byTimeOpts, fetchOpts, byCityOpts, aggregateGranularity, dashboardOpts }
}

export function getCitiesWithinBounds({ params, filters, location, coordinates, activeHostConfiguredName, actions } = {}) {
  const { byCityOpts, aggregateGranularity } = buildOpts({
    params,
    filters,
    location,
    coordinates,
    activeHostConfiguredName
  })

  actions.startFetching()
  actions.fetchByCity({...byCityOpts, aggregate_granularity: aggregateGranularity }).then(
    actions.finishFetching()
  )
}
