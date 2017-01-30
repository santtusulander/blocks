import { handleActions } from 'redux-actions'

export const CACHE_REQUEST = 'api/CACHE_REQUEST'
export const CACHE_REQUEST_CLEAR = 'api/CACHE_REQUEST_CLEAR'

export default handleActions({
  [CACHE_REQUEST]: (state, { payload }) => ({ ...state, ...payload }),
  [CACHE_REQUEST_CLEAR]: (state, { payload }) => {
    const newState = Object.assign(state, {})
    delete newState[payload]
    return newState
  }
}, {})
