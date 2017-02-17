import Immutable from 'immutable'

export const NETWORK_DATE_FORMAT = 'MMM, D YYYY h:m a'

export const NETWORK_SCROLL_AMOUNT = 25
export const NETWORK_WINDOW_OFFSET = 10

export const NETWORK_NUMBER_OF_NODE_COLUMNS = 4
export const NETWORK_NODES_PER_COLUMN = 8

export const NETWORK_DOMAIN_NAME = 'unifieddeliverynetwork.net'

export const LOCATION_NAME_MIN_LENGTH = 3
export const LOCATION_NAME_MAX_LENGTH = 40

export const CLOUD_PROVIDER_REGION_MIN_LENGTH = 2
export const CLOUD_PROVIDER_REGION_MAX_LENGTH = 40

export const CLOUD_PROVIDER_LOCATION_ID_MIN_LENGTH = 2
export const CLOUD_PROVIDER_LOCATION_ID_MAX_LENGTH = 40

export const MIN_LATITUDE = -90
export const MAX_LATITUDE = 90
export const MIN_LONGTITUDE = -180
export const MAX_LONGTITUDE = 180

export const RIPE_STAT_DATA_API_ENDPOINT = 'https://stat.ripe.net/data'

export const LOCATION_CLOUD_PROVIDER_OPTIONS = [
  { value: 'Bare Metal', label: 'Bare Metal' }
]

export const LOCATION_CLOUD_PROVIDER_ID_OPTIONS = [
  { value: 'sl', label: 'IBM SoftLayer' },
  { value: 'do', label: 'Digital Ocean' },
  { value: 'ec2',label: 'Amazon EC2' }
]

export const NODE_TYPE_OPTIONS = [
  { value: 'sp_edge', label: 'SP Edge' },
  { value: 'udn_core', label: 'UDN Core' }
]

export const NODE_ENVIRONMENT_OPTIONS = [
  { value: 'dev', cacheValue: 'cdx-dev', label: 'Development'  },
  { value: 'test', cacheValue: 'cdx-test', label: 'Testing' },
  { value: 'staging', cacheValue: 'cdx-stag', label: 'Staging' },
  { value: 'production', cacheValue: 'cdx', label: 'Production' }
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
export const FOOTPRINT_UDN_TYPES = [
  { value: 'billing_asn', label: 'Billing ASN' },
  { value: 'on_net', label: 'On Net' },
  { value: 'off_net', label: 'Off Net' }
]

export const FOOTPRINT_DEFAULT_DATA_TYPE = 'ipv4cidr'

export const DISCOVERY_METHOD_TYPE = Immutable.fromJS([
  { key: 1, label: 'BGP Routing Daemons'},
  { key: 2, label: 'Footprints'}
])

export const LBMETHOD_OPTIONS = [
  {value: 'gslb', label: 'portal.network.podForm.lb_method.options.gslb.label'},
  {value: 'lb', label: 'portal.network.podForm.lb_method.options.lb.label'},
  {value: 'referral', label: 'portal.network.podForm.lb_method.options.referral.label'}
]

export const POD_TYPE_OPTIONS = [
  {value: 'core', label: 'portal.network.podForm.pod_type.options.core.label'},
  {value: 'sp_edge', label: 'portal.network.podForm.pod_type.options.sp_edge.label'}
]

export const REQUEST_FWD_TYPE_OPTIONS = [
  {value: 'on_net', label: 'portal.network.podForm.requestForwardType.options.on_net.label'},
  {value: 'public', label: 'portal.network.podForm.requestForwardType.options.public.label'},
  {value: 'gslb_referral', label: 'portal.network.podForm.requestForwardType.options.gslb_referral.label'}
]

export const DISCOVERY_METHOD_OPTIONS = [
  {value: 'BGP', label: 'portal.network.podForm.discoveryMethod.options.bgp.label'},
  {value: 'footprints', label: 'portal.network.podForm.discoveryMethod.options.footprints.label'}
]

export const STATUS_OPTIONS = [
  {value: 1, label: 'portal.network.item.status.provisioning'},
  {value: 2, label: 'portal.network.item.status.disabled'},
  {value: 3, label: 'portal.network.item.status.enabled'},
  {value: 4, label: 'portal.network.item.status.destroying'}
]

export const STATUS_VALUE_DEFAULT = 1

export const POD_PROVIDER_WEIGHT_MIN = 0
export const POD_PROVIDER_WEIGHT_MAX = 1
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
