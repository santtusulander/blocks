import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

import mapActionsToFetchingReducers from '../fetching/actions'

import {receiveEntity, failEntity, removeEntity} from '../entity/reducers'

import iataCodes from './iata-codes/reducers'

export const actionTypes = {
  REQUEST: 'entities/REQUEST',
  RECEIVE: 'entities/RECEIVE',
  REMOVE: 'entities/REMOVE',
  FAIL: 'entities/FAIL'
}

const locations =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('locations'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const accounts =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('accounts'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const footprints = handleActions({
  [actionTypes.RECEIVE] : receiveEntity('footprints'),
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

const pops =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('pops'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const networks =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('networks'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

export default combineReducers({
  accounts,
  nodes,
  groups,
  iataCodes,
  properties,
  pops,
  networks,
  locations,
  footprints,
  fetching: mapActionsToFetchingReducers(actionTypes)
})
