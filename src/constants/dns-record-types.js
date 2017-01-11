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
  'TXT'
]

export default RECORD_TYPES
export const recordFields = {
  type: RECORD_TYPES,
  name: RECORD_TYPES,
  value: RECORD_TYPES,
  ttl: RECORD_TYPES,
  prio: ['MX', 'NAPTR', 'SRV'],
  id: [],
  class: []
}
