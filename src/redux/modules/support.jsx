import {createAction} from 'redux-actions'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import { mapReducers } from '../util'

const TICKET_CREATED = 'TICKET_CREATED'
const TICKET_DELETED = 'TICKET_DELETED'
const TICKET_FETCHED = 'TICKET_FETCHED'
const TICKET_FETCHED_ALL = 'TICKET_FETCHED_ALL'
const TICKET_UPDATED = 'TICKET_UPDATED'

const emptyTickets = Immutable.fromJS({
  activeTicket: undefined,
  allTickets: Immutable.List(),
  fetching: false
})

// REDUCERS

export function createSuccess(state, action) {
  const newTicket = Immutable.fromJS(action.payload)
  return state.merge({
    activeTicket: newTicket,
    allGroups: state.get('allTickets').push(newTicket)
  })
}

export function deleteSuccess(state, action) {
  const newAllTickets = state.get('allTickets')
    .filterNot(ticket => {
      return ticket.get('id') === action.payload.id
    })
  return state.merge({
    allTickets: newAllTickets,
    fetching: false
  })
}

export function deleteFailure(state, action) {
  return state.merge({
    activeTicket: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchSuccess(state, action) {
  return state.merge({
    activeTicket: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchFailure(state) {
  return state.merge({
    activeTicket: null,
    fetching: false
  })
}

export function fetchAllSuccess(state, action) {
  return state.merge({
    allTickets: Immutable.fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchAllFailure(state) {
  return state.merge({
    allTickets: Immutable.List(),
    fetching: false
  })
}

export function updateSuccess(state, action) {
  const updatedTicket = Immutable.fromJS(action.payload)
  const index = state.get('allTickets')
    .findIndex(group => group.get('id') === action.payload.id)
  const newAllTickets = state.get('allTickets').set(index, updatedTicket)
  return state.merge({
    activeTicket: updatedTicket,
    allTickets: newAllTickets,
    fetching: false
  })
}

export function updateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function changeActive(state, action) {
  return state.set('activeGroup', action.payload)
}

export default handleActions({
  TICKET_ACTIVE_TICKET_CHANGED: changeActive,
  TICKET_CREATED: createSuccess,
  TICKET_DELETED: mapReducers(deleteSuccess, deleteFailure),
  TICKET_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  TICKET_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  TICKET_UPDATED: mapReducers(updateSuccess, updateFailure)
}, emptyTickets)

// ACTIONS
