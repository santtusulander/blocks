import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

import {createFetchingReducers} from '../fetching/actions'

//import {mapReducers} from '../../util'
import {receiveEntity, failEntity, removeEntity} from '../entity/reducers'

export const actionTypes = {
  REQUEST: 'entities/REQUEST',
  RECEIVE: 'entities/RECEIVE',
  REMOVE: 'entities/REMOVE',
  FAIL: 'entities/FAIL'
}

const accounts =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('accounts'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const groups =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('groups'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const nodes =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('nodes'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const properties =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('properties'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

export default combineReducers({
  accounts,
  nodes,
  groups,
  properties,
  fetching: createFetchingReducers( actionTypes, 'entities')
})
