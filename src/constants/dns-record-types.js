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
  type: RECORD_TYPES,
  name: RECORD_TYPES,
  value: RECORD_TYPES,
  ttl: RECORD_TYPES.filter(type => type !== 'DNAME'),
  prio: ['MX']
}
