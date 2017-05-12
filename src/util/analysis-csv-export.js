import Papa from 'papaparse'
import download from 'downloadjs'
import moment from 'moment'
import numeral from 'numeral'
import Immutable from 'immutable'

import { formatBytes, formatMoment } from './helpers'

function filterByServiceType(serviceTypes) {
  return item => serviceTypes.includes(
    item.get('service_type')
  )
}

const formatContributionData = data => data.reduce((byCountry, provider) => {
  const countryRecord = provider.get('countries').map(country => ({
    provider: provider.get('name'),
    country: country.get('name'),
    bytes: country.get('bytes'),
    percent_total: country.get('percent_total')
  }))
  byCountry.push(...countryRecord)
  return byCountry
}, [])

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
    'contribution': data => {
      const toExport = formatContributionData(data).map(({ country, provider, bytes, percent_total }) => ({
        country,
        provider,
        bytes: formatBytes(bytes),
        percent_total: numeral(percent_total).format('0%')
      }))
      generate('Contribution', Immutable.fromJS(toExport))
    },
    'file-error': (fileErrorURLs, serviceTypes) => {
      const data = fileErrorURLs.filter(filterByServiceType(serviceTypes))
      generate('File Errors', data)
    },
    'cache-hit-rate': cacheHitRate => {
      const data = cacheHitRate.map(item => ({
        timestamp: formatMoment(moment(item.get('timestamp'))),
        cache_hit_ratio: item.get('chit_ratio') || 0
      }))
      generate('Cache Hit Rate', data)
    },
    'url-report': urlMetrics => {
      generate('URL Report', urlMetrics)
    },
    'storage': storageStats => {
      const data = storageStats.map(item => {
        return item
          .set('historical_timestamp', formatMoment(moment(item.get('historical_timestamp'), 'X')))
          .set('timestamp', formatMoment(moment(item.get('timestamp'), 'X')))
      })
      generate('Storage Usage', data)
    }
  }
}
