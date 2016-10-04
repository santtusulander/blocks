import Papa from 'papaparse'
import download from 'downloadjs'
import moment from 'moment'
import numeral from 'numeral'
import Immutable from 'immutable'

import { formatBytes } from './helpers'

function filterByServiceType(serviceTypes) {
  return item => serviceTypes.includes(
    item.get('service_type')
  )
}

const formatContributionData = data => data.reduce((byCountry, provider) => {
  const countryRecord = provider.countries.map(country => ({
    provider: provider.name,
    country: country.name,
    bytes: country.bytes,
    percent_total: country.percent_total
  }))
  byCountry.push(...countryRecord)
  return byCountry
}, [])

function mapTimestamps(item) {
  return item.set('timestamp', moment(item.get('timestamp')).format())
}

export function createCSVExporters(filenamePart) {
  function generate(name, data) {
    const jsData = data.toJS ? data.toJS() : data
    download(
      Papa.unparse(jsData),
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
      generate('Service Provider', toExport)
    },
    'file-error': (fileErrorURLs, serviceTypes) => {
      const data = fileErrorURLs.filter(filterByServiceType(serviceTypes))
      generate('File Errors', data)
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
