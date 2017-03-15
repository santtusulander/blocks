import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import { mapReducers } from '../../util'
import { getAccessKeySuccess, getAccessKeyFailure } from '../../modules/user'
import * as actionTypes from './actionTypes'

const initialState = Map()
/**
 * TODO: add handlers for read and upload progress actions
 */
export default handleActions({
  [actionTypes.GET_ACCESS_KEY]: mapReducers(getAccessKeySuccess, getAccessKeyFailure)
}, initialState)
