import Immutable from 'immutable'

import * as PERMISSIONS from './permissions'

export default Immutable.fromJS([
  {
    key: 'traffic',
    filters: ['date-range', 'service-type'],
    permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW
  },
  {
    key: 'cache-hit-rate',
    filters: ['date-range'],
    permission: PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW
  },  {
    key: 'on-off-net',
    filters: ['date-range', 'on-off-net', 'service-provider'],
    permission: PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET
  },
  {
    key: 'service-providers',
    filters: ['date-range', 'service-provider', 'pop', 'service-type', 'on-off-net'],
    permission: PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION
  },
  {
    key: 'visitors',
    filters: ['date-range'],
    permission: PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS
  },
  {
    key: 'file-error',
    filters: ['date-range', 'error-code', 'service-type'],
    permission: PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR
  },
  {
    key: 'url-report',
    filters: ['date-range', 'error-code', 'service-type'],
    permission: PERMISSIONS.VIEW_ANALYTICS_URL
  },
  {key: 'playback-demo', filters: ['video'], permission: null}
])
