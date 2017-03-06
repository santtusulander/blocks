import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

//import createFetchingReducers from '../fetching/actions'

import {mapReducers} from '../../util'
import {receiveEntity, failEntity, removeEntity} from '../entity/reducers'

export const actionTypes = {
  CREATE:'serviceInfo/CREATE',
  FETCH: 'serviceInfo/FETCH',
  FETCH_ALL: 'serviceInfo/FETCH_ALL',
  REMOVE: 'serviceInfo/REMOVE',
  UPDATE: 'serviceInfo/UPDATE',
  START_FETCHING: 'serviceInfo/START_FETCHING'
}

const services =
  handleActions({
    [actionTypes.CREATE]:  mapReducers(receiveEntity('services'), failEntity),
    [actionTypes.FETCH]:  mapReducers(receiveEntity('services'), failEntity),
    [actionTypes.FETCH_ALL]:  mapReducers(receiveEntity('services'), failEntity),
    [actionTypes.REMOVE]:  mapReducers(removeEntity, failEntity),
    [actionTypes.UPDATE]:  mapReducers(receiveEntity('services'), failEntity)
  }, Map())

const providerTypes =
  handleActions({
    [actionTypes.CREATE]:  mapReducers(receiveEntity('provider_types'), failEntity),
    [actionTypes.FETCH]:  mapReducers(receiveEntity('provider_types'), failEntity),
    [actionTypes.FETCH_ALL]:  mapReducers(receiveEntity('provider_types'), failEntity),
    [actionTypes.REMOVE]:  mapReducers(removeEntity, failEntity),
    [actionTypes.UPDATE]:  mapReducers(receiveEntity('provider_types'), failEntity)
  }, Map())

const regions =
  handleActions({
    [actionTypes.CREATE]:  mapReducers(receiveEntity('regions'), failEntity),
    [actionTypes.FETCH]:  mapReducers(receiveEntity('regions'), failEntity),
    [actionTypes.FETCH_ALL]:  mapReducers(receiveEntity('regions'), failEntity),
    [actionTypes.REMOVE]:  mapReducers(removeEntity, failEntity),
    [actionTypes.UPDATE]:  mapReducers(receiveEntity('regions'), failEntity)
  }, Map())

export default combineReducers({
  services,
  providerTypes,
  regions
  //fetching: createFetchingReducers( actionTypes, 'serviceInfo')
})
