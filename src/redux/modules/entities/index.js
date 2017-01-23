import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

import {createFetchingReducers} from '../fetching/actions'

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

const properties =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('properties'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const pops =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('pops'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const pods =
    handleActions({
      [actionTypes.RECEIVE] : receiveEntity('pods'),
      [actionTypes.REMOVE] : removeEntity,
      [actionTypes.FAIL] : failEntity
    }, Map())

const footprints =
    handleActions({
      [actionTypes.RECEIVE] : receiveEntity('footprints'),
      [actionTypes.REMOVE] : removeEntity,
      [actionTypes.FAIL] : failEntity
    }, Map())



//const entities = combineReducers({
export default combineReducers({
  accounts,
  groups,
  properties,
  pops,
  pods,
  footprints,
  fetching: createFetchingReducers( actionTypes, 'entities')
})
