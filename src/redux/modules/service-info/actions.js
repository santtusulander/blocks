import {createAction} from 'redux-actions'
import * as api from './api'
import {actionTypes} from './index'

/*actions creators*/
export const startFetching = createAction(actionTypes.START_FETCHING)

export const fetchAll = createAction(actionTypes.FETCH_ALL, () => {
  return api.fetchAll()
})

/*
TODO: Add missing API methods

 export const fetch = createAction(actionTypes.FETCH, (brand, account, group, id) => {
  return api.fetch( brand, account, group, id)
})
*/
