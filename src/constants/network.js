import Immutable from 'immutable'

export const NETWORK_SCROLL_AMOUNT = 25
export const NETWORK_WINDOW_OFFSET = 10

export const NETWORK_NUMBER_OF_NODE_COLUMNS = 4
export const NETWORK_NODES_PER_COLUMN = 8

export const NETWORK_DOMAIN_NAME = 'unifieddeliverynetwork.net'

export const RIPE_STAT_DATA_API_ENDPOINT = 'https://stat.ripe.net/data'

export const NODE_TYPE_OPTIONS = [
  { value: 'sp_edge', label: 'SP Edge' },
  { value: 'udn_core', label: 'UDN Core' }
]

export const NODE_ENVIRONMENT_OPTIONS = [
  { value: 'dev', cacheValue: 'cdx-dev', label: 'Development'  },
  { value: 'test', cacheValue: 'cdx-test', label: 'Testing' },
  { value: 'staging', cacheValue: 'cdx-stag', label: 'Staging' },
  { value: 'production', cacheValue: 'cdx-prod', label: 'Production' }
]

export const NODE_ROLE_OPTIONS = [
  { value: 'cache', label: 'Cache' },
  { value: 'gslb', label: 'GSLB' },
  { value: 'slsb', label: 'SLSB' }
]

export const NODE_CLOUD_DRIVER_OPTIONS = [
  { value: 'ec2', label: 'AWS' },
  { value: 'do', label: 'Digital Ocean' },
  { value: 'sl', label: 'SoftLayer' },
  { value: 'os', label: 'OpenStack' },
  { value: 'vw', label: 'VmWare' },
  { value: 'bm', label: 'Bare Metal' }
]
export const FOOTPRINT_UDN_TYPES = [
  { value: 'billing_asn', label: 'Billing ASN' },
  { value: 'on_net', label: 'On Net' },
  { value: 'off_net', label: 'Off Net' }
]

export const DISCOVERY_METHOD_TYPE = Immutable.fromJS([
  { key: 1, label: 'BGP Routing Daemons'},
  { key: 2, label: 'Footprints'}
])

export const POD_PROVIDER_WEIGHT_MIN = 0
export const POP_ID_MIN = 1
export const POP_ID_MAX = 999

export const ASN_MIN = 1
export const ASN_MAX = 4199999999
export const ASN_RESERVED = 23456
export const ASN_RESERVED_RANGE_START = 64496
export const ASN_RESERVED_RANGE_END = 131071

export const ROUTING_DEAMON_PASSWORD_MIN_LEN = 1
export const ROUTING_DEAMON_PASSWORD_MAX_LEN = 64
export const ROUTING_DEAMON_BGP_NAME_MIN_LEN = 1
export const ROUTING_DEAMON_BGP_NAME_MAX_LEN = 255