import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {Map,List} from 'immutable'

import mapActionsToFetchingReducers from '../fetching/actions'

import {receiveEntity, failEntity, removeEntity, receiveMetrics, receiveGroupMetrics, receiveEntityPagination} from '../entity/reducers'

import iataCodes from './iata-codes/reducers'

export const actionTypes = {
  REQUEST: 'entities/REQUEST',
  RECEIVE: 'entities/RECEIVE',
  REMOVE: 'entities/REMOVE',
  FAIL: 'entities/FAIL'
}

export const metricsActionTypes = {
  RECEIVE_METRICS: 'metrics/RECEIVE',
  RECEIVE_GROUP_METRICS: 'metrics/RECEIVE_GROUP',
  RECEIVE_COMPARISON_METRICS: 'metrics/RECEIVE_COMPARISON'
}

const locations =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'locations' }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const accounts =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'accounts', useMergeDeep: false }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const footprints = handleActions({
  [actionTypes.RECEIVE]: receiveEntity({ key: 'footprints' }),
  [actionTypes.REMOVE]: removeEntity,
  [actionTypes.FAIL]: failEntity
}, Map())

const groups =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'groups', useMergeDeep: false }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const nodes =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'nodes' }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const properties =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'properties', useMergeDeep: false }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const pops =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'pops' }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const pods =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'pods', useMergeDeep: false }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const networks =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'networks' }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const CISIngestPoints =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'ingestPoints' }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const CISIngestPointContents =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'ingestPointContents' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const CISClusters =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'clusters' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const CISWorkflowProfiles =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'workflowProfiles' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const storageMetrics =
  handleActions({
    [metricsActionTypes.RECEIVE_METRICS]: receiveMetrics({ key: 'storageMetrics' }),
    [metricsActionTypes.RECEIVE_GROUP_METRICS]: receiveGroupMetrics(),
    [metricsActionTypes.RECEIVE_COMPARISON_METRICS]: receiveMetrics({ key: 'storageMetrics', comparison: true }),
    [actionTypes.FAIL]: failEntity
  }, Map({ comparisonData: Map(), data: Map(), groupData: List() }))

const roles =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'roles' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const roleNames =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'roleNames' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const serviceTitles =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'serviceTitles' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const gtm =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'gtm', useMergeDeep: false }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const propertyMetadata =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'propertyMetadata' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const users =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'users' }),
    [actionTypes.REMOVE]: removeEntity,
    [actionTypes.FAIL]: failEntity
  }, Map())

const entityPagination =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntityPagination
  }, Map())

export default combineReducers({
  accounts,
  nodes,
  groups,
  iataCodes,
  CISIngestPoints,
  CISIngestPointContents,
  gtm,
  CISClusters,
  CISWorkflowProfiles,
  properties,
  propertyMetadata,
  pops,
  networks,
  pods,
  locations,
  footprints,
  storageMetrics,
  roles,
  roleNames,
  serviceTitles,
  users,
  fetching: mapActionsToFetchingReducers({ ...actionTypes, ...metricsActionTypes }),
  entityPagination
})
