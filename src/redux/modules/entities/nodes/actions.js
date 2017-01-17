import { fetch } from './api'
import { actionTypes } from '../index'

export const fetchAll = (brand, account, group) => ({
  types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
  cacheKey: `fetch-nodes-${brand}-${account}-${group}`,
  callApi: fetch
})

// groups-fetch-all-udn-232-565
