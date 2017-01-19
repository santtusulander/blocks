import { handleActions } from 'redux-actions'


export default handleActions({
  CACHE_REQUEST: (state, { payload }) => ({ ...state, ...payload }),
  CACHE_REQUEST_CLEAR: (state, { payload }) => {
    const newState = Object.assign(state, {})
    delete newState[payload]
    return newState
  }
}, {})
