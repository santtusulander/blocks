import Immutable from 'immutable'

import * as PERMISSIONS from './permissions'

export default Immutable.fromJS([
  {
    key: 'traffic',
    filters: ['dateRange', 'includeComparison', 'serviceTypes', 'recordType'],
    permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW
  },
  {
    key: 'cache-hit-rate',
    filters: ['dateRange'],
    permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW
  },
  {
    key: 'on-off-net',
    filters: ['dateRange', 'onOffNet'],
    permission: PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET
  },
  {
    key: 'contribution',
    filters: ['dateRange', 'serviceProviders', 'contentProviders', 'serviceTypes', 'onOffNet'],
    permission: PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION
  },
  {
    key: 'storage',
    filters: ['dateRange', 'storageType'],
    permission: PERMISSIONS.VIEW_ANALYTICS_STORAGE
  },
  {
    key: 'visitors',
    filters: ['customDateRange'],
    permission: PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS
  },
  {
    key: 'file-error',
    filters: ['dateRange', 'errorCodes', 'serviceTypes'],
    permission: PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR
  },
  {
    key: 'url-report',
    filters: ['dateRange', 'statusCodes', 'serviceTypes'],
    permission: PERMISSIONS.VIEW_ANALYTICS_URL
  },
  {key: 'playback-demo', filters: ['video'], permission: null}
])
