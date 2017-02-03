export const NETWORK_SCROLL_AMOUNT = 25
export const NETWORK_WINDOW_OFFSET = 10

export const NETWORK_NUMBER_OF_NODE_COLUMNS = 4
export const NETWORK_NODES_PER_COLUMN = 8

export const RIPE_STAT_DATA_API_ENDPOINT = 'https://stat.ripe.net/data'

export const NODE_TYPE_OPTIONS = [
  { value: 'sp_edge', label: 'SP Edge' },
  { value: 'udn_core', label: 'UDN Core' }
]

export const NODE_ENVIRONMENT_OPTIONS = [
  { value: 'dev', label: 'Development' },
  { value: 'test', label: 'Testing' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' }
]

export const NODE_ROLE_OPTIONS = [
  { value: 'cache', label: 'Cache' },
  { value: 'gslb', label: 'GSLB' },
  { value: 'slsb', label: 'SLSB' }
]

export const NODE_CLOUD_DRIVER_OPTIONS = [
  { value: 1, label: 'Amazon EC2' },
  { value: 2, label: 'Digital Ocean' },
  { value: 3, label: 'SoftLayer' },
  { value: 4, label: 'OpenStack' },
  { value: 5, label: 'VMWare' },
  { value: 6, label: 'Bare Metal' },
  { value: 7, label: 'LXC' },
  { value: 8, label: 'Docker' }
]

export const POD_PROVIDER_WEIGHT_MIN = 0
export const POP_ID_MIN = 1
export const POP_ID_MAX = 999
