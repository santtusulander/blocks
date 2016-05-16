import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {topoBase} from '../util'

const TOPO_START_FETCH = 'TOPO_START_FETCH'
const TOPO_COUNTRIES_FETCHED = 'TOPO_COUNTRIES_FETCHED'
const TOPO_STATES_FETCHED = 'TOPO_STATES_FETCHED'
const TOPO_CITIES_FETCHED = 'TOPO_CITIES_FETCHED'
const TOPO_ACTIVE_COUNTRY_CHANGED = 'TOPO_ACTIVE_COUNTRY_CHANGED'
const TOPO_ACTIVE_STATE_CHANGED = 'TOPO_ACTIVE_STATE_CHANGED'

const emptyTopology = Immutable.Map({
  activeCountry: null,
  activeState: null,
  cities: Immutable.Map(),
  countries: Immutable.Map(),
  fetching: false,
  states: Immutable.Map()
})

// REDUCERS

export default handleActions({
  TOPO_COUNTRIES_FETCHED: {
    next(state, action) {
      return state.merge({
        countries: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        countries: Immutable.Map(),
        fetching: false
      })
    }
  },
  TOPO_STATES_FETCHED: {
    next(state, action) {
      return state.merge({
        states: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        states: Immutable.Map(),
        fetching: false
      })
    }
  },
  TOPO_CITIES_FETCHED: {
    next(state, action) {
      return state.merge({
        cities: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        cities: Immutable.Map(),
        fetching: false
      })
    }
  },
  TOPO_START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  TOPO_ACTIVE_COUNTRY_CHANGED: (state, action) => {
    return state.merge({
      activeCountry: action.payload,
      activeState: null,
      states: Immutable.Map(),
      cities: Immutable.Map()
    })
  },
  TOPO_ACTIVE_STATE_CHANGED: (state, action) => {
    return state.merge({
      activeState: action.payload,
      cities: Immutable.Map()
    })
  }
}, emptyTopology)

// ACTIONS

export const fetchCountries = createAction(TOPO_COUNTRIES_FETCHED, () => {
  return axios.get(`${topoBase()}/countries.topo.json`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchStates = createAction(TOPO_STATES_FETCHED, (country) => {
  return axios.get(`${topoBase()}/states_${country}.topo.json`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchCities = createAction(TOPO_CITIES_FETCHED, (country) => {
  return axios.get(`${topoBase()}/cities_${country}.topo.json`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const startFetching = createAction(TOPO_START_FETCH)

export const changeActiveCountry = createAction(TOPO_ACTIVE_COUNTRY_CHANGED)

export const changeActiveState = createAction(TOPO_ACTIVE_STATE_CHANGED)
