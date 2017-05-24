import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'

import { MAPBOX_CITY_LEVEL_ZOOM } from '../../constants/mapbox'

const MAPBOX_SET_BOUNDS = 'MAPBOX_SET_BOUNDS'
const MAPBOX_SET_ZOOM = 'MAPBOX_SET_ZOOM'

const initialState = Immutable.fromJS({
  mapBounds: {},
  mapZoom: MAPBOX_CITY_LEVEL_ZOOM - 1
})

// REDUCERS
export function mapboxMapBounds(state, action) {
  return state.merge({
    mapBounds: Immutable.fromJS(action.payload)
  })
}

export function mapboxMapZoom(state, action) {
  return state.merge({
    mapZoom: action.payload
  })
}

export default handleActions({
  MAPBOX_SET_BOUNDS: mapboxMapBounds,
  MAPBOX_SET_ZOOM: mapboxMapZoom
}, initialState)

export const setMapBounds = createAction(MAPBOX_SET_BOUNDS)
export const setMapZoom = createAction(MAPBOX_SET_ZOOM)
