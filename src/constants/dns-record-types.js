const RECORD_TYPES = [
  'A',
  'AAAA',
  'CNAME',
  'DNAME',
  'HINFO',
  'MX',
  'NAPTR',
  'NS',
  'PTR',
  'SPF',
  'SRV',
  'TXT',
  'SOA'
]

export default RECORD_TYPES
export const recordFields = {
  recordType: RECORD_TYPES,
  hostName: RECORD_TYPES,
  targetValue: RECORD_TYPES,
  ttl: RECORD_TYPES.filter(type => type !== 'DNAME'),
  priority: ['MX']
}

