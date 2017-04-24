import { recordFields } from '../constants/dns-record-types'

export const getRecordValueString = (value) => {
  if (value.value) {
    return value.value
  }

  return value
}

export const getRecordFormInitialValues = record => {
  switch (record.type) {
    case 'MX':
    case 'NAPTR':
    case 'SRV':
      return {
        value: record.value.value,
        prio: record.value.prio,
        name: record.name,
        type: record.type,
        ttl: record.ttl
      }
    default: return record
  }
}

export const isShown = recordType => field => recordFields[field] && recordFields[field].indexOf(recordType) >= 0

export const recordValues = values => {
  if (isShown(values.type)('prio')) {
    const value = { prio: values.prio, value: values.value }
    delete values.prio
    delete values.value
    return { value, ...values }
  }
  return values
}
