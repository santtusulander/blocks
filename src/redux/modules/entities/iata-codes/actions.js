import * as api from './api'
import actionCreatorBuilder from '../action-creators'

export const REQUEST = 'IATA/REQUEST'
export const RECEIVE = 'IATA/RECEIVE'
export const FAIL = 'IATA/FAIL'

export default actionCreatorBuilder({
  receiveActionTypes: [ REQUEST, RECEIVE, FAIL ],
  entityType: 'iataCodes',
  api
})
