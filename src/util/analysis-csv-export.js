import Papa from 'papaparse'
import download from 'downloadjs'
import moment from 'moment'
import Immutable from 'immutable'

function filterByServiceType(serviceTypes) {
  return item => serviceTypes.includes(
    item.get('service_type')
  )
}

function mapTimestamps(item) {
  return item.set('timestamp', moment(item.get('timestamp')).format())
}

export function createCSVExporters(filenamePart) {
  function generate(name, data) {
    download(
      Papa.unparse(data.toJS()),
      `${name} - ${filenamePart}.csv`,
      'text/csv'
    )
  }

  return {
    'traffic': (traffic, serviceTypes) => {
      const data = traffic
        .filter(filterByServiceType(serviceTypes))
        .map(mapTimestamps)
      generate('Traffic', data)
    },
    'visitors': visitors => {
      const data = visitors.map(mapTimestamps)
      generate('Visitors', data)
    },
    'on-off-net': onOffNet => {
      const data = onOffNet
        .map(item => Immutable.Map({
          timestamp: moment(item.get('timestamp')).format(),
          on_net: item.getIn(['net_on', 'bytes']),
          off_net: item.getIn(['net_off', 'bytes']),
          total: item.get('total')
        }))
      generate('On Off Net', data)
    },
    'contribution': onOffNet => {
      const data = onOffNet
        .map(item => Immutable.Map({
          timestamp: moment(item.get('timestamp')).format(),
          on_net: item.getIn(['net_on', 'bytes']),
          off_net: item.getIn(['net_off', 'bytes']),
          total: item.get('total')
        }))
      generate('Service Provider', data)
    },
    'file-error': (fileErrorURLs, serviceTypes) => {
      const data = fileErrorURLs.filter(filterByServiceType(serviceTypes))
      generate('File Errors', data)
    },
    'cache-hit-rate': cacheHitRate => {
      const data = cacheHitRate.map(item => ({
        timestamp: moment(item.get('timestamp')).format(),
        cache_hit_ratio: item.get('chit_ratio') || 0
      }))
      generate('Cache Hit Rate', data)
    },
    'url-report': urlMetrics => {
      generate('URL Report', urlMetrics)
    },
    'storage-usage': storageStats => {
      const data = storageStats.map(mapTimestamps)
      generate('Storage Usage', data)
    }
  }
}
