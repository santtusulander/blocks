import { buildFetchOpts } from './helpers'

import {
  MAPBOX_BOUNDS_CHANGE_PERCENTAGE
} from '../constants/mapbox'

/**
 * Calculate Median -value
 * @param values
 * @returns {value}
 */
export const calculateMedian = (values) => {

  values.sort(function(a,b) {
    return a - b;
  });

  const half = Math.floor(values.length/2);

  if (values.length % 2)    {
    return values[half];
  }  else    {
    return (values[half-1] + values[half]) / 2.0;
  }
}
/**
 * Get Score for value compared to 'median' range (0 - steps)
 * @param median
 * @param value
 * @param steps
 * @returns {number}
 */
export const getScore = (median, value, steps = 5) => {

  const diff = (value / median)
  const score = Math.ceil(diff * (steps / 2)) ;

  return score;
}

/**
 * Checks if map bounds have changed x-percentage.
 *
 * @method checkChangeInBounds
 * @param  {object}            currentBounds Object of map bounds saved in Redux
 *                                           –– previous map bounds
 * @param  {object}            newBounds     LngLatBounds object of new map bounds
 * @return {boolean}                         Return true or false if any change is over x-percentage
 */
export const checkChangeInBounds = (currentBounds, newBounds) => {
  // Build an object of bounds so we can reference them nicely later on
  const boundsArray = {
    south: newBounds.getSouth(),
    west: newBounds.getWest(),
    north: newBounds.getNorth(),
    east: newBounds.getEast()
  }

  // Calculates percent difference between current and new bounds
  const boundsChangedBy = currentBounds.keySeq().map((key) => {
    return {
      difference: Math.abs(100 - (currentBounds.get(key) / boundsArray[key] * 100))
    }
  })

  // Checks if at least one of the bound values has changed over x-percent
  return boundsChangedBy.some((bound) => bound.difference >= MAPBOX_BOUNDS_CHANGE_PERCENTAGE)
}

/**
 * Fetches city data with specific bounds and options
 *
 * @method getCitiesWithinBounds
 * @param  {Object}              params                   Object of values to match
 * @param  {Object}              filters                  Filters to match, e.g. date range
 * @param  {String}              location                 Page location
 * @param  {Object}              coordinates              Object of map bounds, lngLat coordinates
 * @param  {String}              activeHostConfiguredName String of active host
 * @param  {Object}              actions                  Object of which actions should be called
 * @param  {Object}              aggregation              Aggregation settings
 * @returns {Promise}
 */
export function getCitiesWithinBounds({ params, filters, location, coordinates, activeHostConfiguredName, actions, aggregation } = {}) {
  const { byCityOpts } = buildFetchOpts({
    params,
    filters,
    location,
    coordinates,
    activeHostConfiguredName
  })

  actions.startFetching()
  return actions.fetchByCity({...byCityOpts, aggregate_granularity: aggregation }).then(
    actions.finishFetching()
  )
}
