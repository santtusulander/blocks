import {createAction} from 'redux-actions'

import * as api from './api'
import {actionTypes} from '../index'

export const fetch = createAction(actionTypes.FETCH, (brand, account, group) => {
  return api.fetch( brand, account, group)
})

export const fetchAll = createAction(actionTypes.FETCH_ALL, (brand, account) => {
  return api.fetchAll( brand, account)
})
