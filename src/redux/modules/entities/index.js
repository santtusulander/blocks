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
    [actionTypes.RECEIVE] : receiveEntity({ key: 'locations' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const accounts =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'accounts' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const footprints = handleActions({
  [actionTypes.RECEIVE] : receiveEntity({ key: 'footprints' }),
  [actionTypes.REMOVE] : removeEntity,
  [actionTypes.FAIL] : failEntity
}, Map())

const groups =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'groups' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const nodes =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'nodes' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const properties =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'properties' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const pops =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'pops' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const pods =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'pods' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const networks =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'networks' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())


const CISIngestPoints =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'ingestPoints' }),
    [actionTypes.REMOVE] : removeEntity,
    [actionTypes.FAIL] : failEntity
  }, Map())

const CISClusters =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'clusters' }),
    [actionTypes.FAIL] : failEntity
  }, Map())

const CISWorkflowProfiles =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'workflowProfiles' }),
    [actionTypes.FAIL] : failEntity
  }, Map())

const storageMetrics =
  handleActions({
    [actionTypes.RECEIVE] : receiveEntity({ key: 'storageMetrics', useMergeDeep: false }),
    [actionTypes.FAIL] : failEntity
  }, Map())

export default combineReducers({
  accounts,
  nodes,
  groups,
  iataCodes,
  CISIngestPoints,
  CISClusters,
  CISWorkflowProfiles,
  properties,
  pops,
  networks,
  pods,
  locations,
  footprints,
  storageMetrics,
  fetching: mapActionsToFetchingReducers(actionTypes)
})
