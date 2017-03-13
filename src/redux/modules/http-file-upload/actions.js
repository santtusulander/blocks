import { createAction } from 'redux-actions'
import { bindActionCreators } from 'redux'
import * as api from './api'
import * as actionTypes from './actionTypes'


const actionCreators = {
  [actionTypes.GET_ACCESS_KEY]: createAction(actionTypes.GET_ACCESS_KEY, (id) => api.getAccessKeyById(id))
}

export default (dispatch) => bindActionCreators(actionCreators, dispatch)


