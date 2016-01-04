import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {acceptJSON, urlBase} from '../util'

const CREATED = 'CREATED'
const DELETED = 'DELETED'
const FETCHED = 'FETCHED'
const FETCHED_ALL = 'FETCHED_ALL'
const START_FETCH = 'START_FETCH'
const UPDATED = 'UPDATED'
const ACTIVE_SERVICE_CHANGED = 'ACTIVE_SERVICE_CHANGED'

const emptyService = Immutable.fromJS({
  edge_configuration: {
    published_name: "",
    origin_host_name: "",
    origin_host_port: "",
    host_header: "origin_host_name",
    origin_path_append: ""
  },
  response_policies: [
    {
      defaults: {
        match: "*",
        policies: [
          {
            type: "cache",
            action: "set",
            honor_origin_cache_policies: true
          },
          {
            type: "cache",
            action: "set",
            ignore_case: false
          },
          {
            type: "cache",
            action: "set",
            honor_etags: true
          },
          {
            type: "cache",
            action: "set",
            cache_errors: "10s"
          }
        ]
      }
    }
  ]
});

const emptyServices = Immutable.Map({
  activeService: emptyService,
  allServices: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  CREATED: {
    next(state, action) {
      const newService = Immutable.fromJS(action.payload)
      return state.merge({
        activeService: newService,
        allServices: state.get('allServices').push(newService)
      })
    }
  },
  DELETED: {
    next(state, action) {
      let newAllServices = state.get('allServices')
        .filterNot(service => {
          return service.get('summary').get('published_name') === action.payload.id
        })
      return state.merge({
        allServices: newAllServices,
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  },
  FETCHED: {
    next(state, action) {
      return state.merge({
        activeService: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        activeService: null,
        fetching: false
      })
    }
  },
  FETCHED_ALL: {
    next(state, action) {
      return state.merge({
        allServices: Immutable.fromJS(action.payload),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        allServices: Immutable.List(),
        fetching: false
      })
    }
  },
  START_FETCH: (state) => {
    return state.set('fetching', true)
  },
  UPDATED: {
    next(state, action) {
      const index = state.get('allServices').findIndex(service => {
        return service.get('summary').get('published_name') === action.payload.id
      })
      let newService = Immutable.fromJS(action.payload)
      return state.merge({
        activeService: newService,
        allServices: state.get('allServices').set(index, newService),
        fetching: false
      })
    },
    throw(state) {
      return state.merge({
        fetching: false
      })
    }
  },
  ACTIVE_SERVICE_CHANGED: (state, action) => {
    return state.set('activeService', action.payload)
  }
}, emptyServices)

// ACTIONS

export const createService = createAction(CREATED, (brand, account, group) => {
  return axios.post(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${group}/published_hosts`, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const deleteService = createAction(DELETED, (brand, account, group, id) => {
  return axios.delete(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {
    headers: acceptJSON
  })
  .then(() => {
    return {id: id}
  });
})

export const fetchService = createAction(FETCHED, (brand, account, group, id) => {
  return axios.get(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const fetchServices = createAction(FETCHED_ALL, (brand, account, group) => {
  return axios.get(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${group}/published_hosts`, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const updateService = createAction(UPDATED, (brand, account, group, service) => {
  return axios.put(`${urlBase}/vcdn/v2/${brand}/accounts/${account}/groups/${group}/published_hosts/${service.get('summary').get('published_name')}`, service, {
    headers: acceptJSON
  })
  .then((res) => {
    if(res) {
      return res.data;
    }
  })
})

export const startFetching = createAction(START_FETCH)

export const changeActiveService = createAction(ACTIVE_SERVICE_CHANGED)
