import {createAction} from 'redux-actions'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import { mapReducers } from '../util'

const TICKET_FETCHED = 'TICKET_FETCHED'
const TICKET_FETCHED_ALL = 'TICKET_FETCHED_ALL'

const temporaryShowTicket = {
  "ticket": {"id": 3333, "type": "incident"}
}

const temporaryShowTicketCollection = [{
  "ticket": {"id": 3333, "type": "incident"}
}]

const emptyTickets = Immutable.fromJS({
  activeTicket: undefined,
  allTickets: Immutable.List(),
  fetching: false
})

// REDUCERS

export default handleActions({
  TICKET_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  TICKET_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
}, emptyTickets)
