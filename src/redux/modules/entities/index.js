import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

import mapActionsToFetchingReducers from '../fetching/actions'

import {receiveEntity, failEntity, removeEntity, receiveEntityPagination, removeCISContents} from '../entity/reducers'

import iataCodes from './iata-codes/reducers'

export const actionTypes = {
  REQUEST: 'entities/REQUEST',
  RECEIVE: 'entities/RECEIVE',
  REMOVE: 'entities/REMOVE',
  FAIL: 'entities/FAIL'
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
    [actionTypes.FAIL]: failEntity
  }, Map())

const CISIngestPointContents =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'ingestPointContents' }),
    [actionTypes.REMOVE]: removeCISContents,
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

const roles =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'roles' }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const allowedRoles =
    handleActions({
      [actionTypes.RECEIVE]: receiveEntity({ key: 'allowedRoles' }),
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

const mapMarkers =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'mapMarkers' })
  }, Map())

const publishedUrls =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'publishedUrls' })
  }, Map())

const storageMetrics =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'storageMetrics', useMergeDeep: false }),
    [actionTypes.FAIL]: failEntity
  }, Map())

const fileErrorMetrics =
  handleActions({
    [actionTypes.RECEIVE]: receiveEntity({ key: 'fileErrorMetrics', useMergeDeep: false }),
    [actionTypes.FAIL]: failEntity
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
  fileErrorMetrics,
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
  allowedRoles,
  serviceTitles,
  users,
  fetching: mapActionsToFetchingReducers(actionTypes),
  entityPagination,
  mapMarkers,
  publishedUrls
})
