import axios from 'axios'
import { createAction } from 'redux-actions'
import { handleActions } from 'redux-actions'
import Immutable from 'immutable'

import { mapReducers } from '../util'

const TICKET_ACTIVE_TICKET_CHANGED = 'TICKET_ACTIVE_TICKET_CHANGED'
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
  const newTicket = Immutable.fromJS(action.payload.ticket)
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
    activeTicket: Immutable.fromJS(action.payload.ticket),
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
    allTickets: Immutable.fromJS(action.payload.tickets),
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

export const createTicket = createAction(TICKET_CREATED, (data) => {
  //noinspection Eslint
  console.log('created ticket', data)
})

export const deleteTicket = createAction(TICKET_DELETED, (id) => {
  //noinspection Eslint
  return console.log("deleted ticket " + id);
})

export const fetchTicket = createAction(TICKET_FETCHED, (id) => {
  return {"ticket": {
    "id": id,
    "organization_id": 509974,
    "subject": "My computer is on fire!",
    "priority": "high",
    "status": "open",
    "type": "task",
    "comment_count": "5",
    "description": "The fire is very colorful."
  }};
})

export const fetchTickets = createAction(TICKET_FETCHED_ALL, () => {
  const organization_id = 12345;
  return {"data": [
    {
      "id": 3678,
      "organization_id": organization_id,
      "subject": "My computer is on fire!",
      "priority": "urgent",
      "status": "open",
      "type": "task",
      "comment_count": "1",
      "description": "The fire is very colorful."
    },
    {
      "id": 3699,
      "organization_id": organization_id,
      "subject": "Load balancer configuration error",
      "priority": "high",
      "status": "open",
      "type": "question",
      "comment_count": "0",
      "description": "The fire is very colorful."
    },
    {
      "id": 4008,
      "organization_id": organization_id,
      "subject": "My computer is on fire!",
      "priority": "low",
      "status": "new",
      "type": "incident",
      "comment_count": "6",
      "description": "The fire is very colorful."
    },
    {
      "id": 5679,
      "organization_id": organization_id,
      "subject": "My computer is on fire!",
      "priority": "urgent",
      "status": "closed",
      "type": "integration",
      "comment_count": "4",
      "description": "The fire is very colorful."
    },
    {
      "id": 6331,
      "organization_id": organization_id,
      "subject": "My computer is on fire!",
      "priority": "high",
      "status": "solved",
      "type": "problem",
      "comment_count": "8",
      "description": "The fire is very colorful."
    }
  ]};
})

export const updateTicket = createAction(TICKET_UPDATED, (id) => {
  //noinspection Eslint
  return console.log("updateTicket ticket " + id);
})

export const changeActiveTicket = createAction(TICKET_ACTIVE_TICKET_CHANGED)
