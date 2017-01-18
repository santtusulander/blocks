import { handleActions } from 'redux-actions'

export default handleActions({
  CACHE_REQUEST: (state, { payload }) => ({ ...state, ...payload })
}, {})
