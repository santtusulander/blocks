export const NETWORK_SCROLL_AMOUNT = 25
export const NETWORK_WINDOW_OFFSET = 10

export const NETWORK_NUMBER_OF_NODE_COLUMNS = 4
export const NETWORK_NODES_PER_COLUMN = 8

export const NETWORK_DOMAIN_NAME = 'unifieddeliverynetwork.net'

export const LOCATION_NAME_MIN_LENGTH = 3
export const LOCATION_NAME_MAX_LENGTH = 40

export const IATA_FIXED_LENGTH = 3

export const CLOUD_PROVIDER_REGION_MIN_LENGTH = 2
export const CLOUD_PROVIDER_REGION_MAX_LENGTH = 40

export const CLOUD_PROVIDER_LOCATION_ID_MIN_LENGTH = 2
export const CLOUD_PROVIDER_LOCATION_ID_MAX_LENGTH = 40

export const MIN_LATITUDE = -90
export const MAX_LATITUDE = 90
export const MIN_LONGTITUDE = -180
export const MAX_LONGTITUDE = 180

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
