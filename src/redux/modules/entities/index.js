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

    //[actionTypes.REQUEST] : receiveEntity('accounts'),
    // [actionTypes.CREATE]:  mapReducers(receiveEntity('accounts'), failEntity),
    // [actionTypes.FETCH]:  mapReducers(receiveEntity('accounts'), failEntity),
    // [actionTypes.FETCH_ALL]:  mapReducers(receiveEntity('accounts'), failEntity),
    // [actionTypes.FETCH_ALL_WITH_DETAILS]:  mapReducers(receiveEntity('accounts'), failEntity),
    // [actionTypes.REMOVE]:  mapReducers(removeEntity, failEntity),
    // [actionTypes.UPDATE]:  mapReducers(receiveEntity('accounts'), failEntity)
  }, Map())

const groups =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity('groups'),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity


    // [actionTypes.CREATE]:  mapReducers(receiveEntity('groups'), failEntity),
    // [actionTypes.FETCH]:  mapReducers(receiveEntity('groups'), failEntity),
    // [actionTypes.FETCH_ALL]:  mapReducers(receiveEntity('groups'), failEntity),
    // [actionTypes.FETCH_ALL_WITH_DETAILS]:  mapReducers(receiveEntity('groups'), failEntity),
    // [actionTypes.REMOVE]:  mapReducers(removeEntity, failEntity),
    // [actionTypes.UPDATE]:  mapReducers(receiveEntity('groups'), failEntity)
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

    // [actionTypes.CREATE]:  mapReducers(receiveEntity('properties'), failEntity),
    // [actionTypes.FETCH]:  mapReducers(receiveEntity('properties'), failEntity),
    // [actionTypes.FETCH_ALL]:  mapReducers(receiveEntity('properties'), failEntity),
    // [actionTypes.FETCH_ALL_WITH_DETAILS]:  mapReducers(receiveEntity('properties'), failEntity),
    // [actionTypes.REMOVE]:  mapReducers(removeEntity, failEntity),
    // [actionTypes.UPDATE]:  mapReducers(receiveEntity('properties'), failEntity)
  }, Map())

const entities = combineReducers({
  accounts,
  //accountGroups,
  nodes,
  groups,
  //groupProperties,
  properties
})

export default combineReducers({
  entities,
  fetching: createFetchingReducers( actionTypes, 'entities')
})
