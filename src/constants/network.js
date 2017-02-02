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

export const FOOTPRINT_UDN_TYPES = [
  { value: 'billing_asn', label: 'Billing ASN' },
  { value: 'on_net', label: 'On Net' },
  { value: 'off_net', label: 'Off Net' }
]

export const FOOTPRINT_DATA_TYPES = [
  { value: 'ipv4cidr', label: 'Billing ASN' },
  { value: 'asnlist', label: 'On Net' }
]

export const POD_PROVIDER_WEIGHT_MIN = 0
export const POP_ID_MIN = 1
export const POP_ID_MAX = 999
