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
  { value: 'ec2', label: 'AWS' },
  { value: 'do', label: 'Digital Ocean' },
  { value: 'sl', label: 'SoftLayer' },
  { value: 'os', label: 'OpenStack' },
  { value: 'vw', label: 'VmWare' },
  { value: 'bm', label: 'Bare Metal' }
]

export const FORMS_NAME_MIN_LEN = 3
export const FORMS_NAME_MAX_LEN = 40
export const FORMS_DESCRIPTION_MIN_LEN = 3
export const FORMS_DESCRIPTION_MAX_LEN = 255
