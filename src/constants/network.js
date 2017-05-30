import Immutable from 'immutable'
import React from 'react'
import { FormattedMessage } from 'react-intl'

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

export const CLOUD_PROVIDER_LOCATION_NAME_WITHOUT_IDS = 'Bare Metal'

export const MIN_LATITUDE = -90
export const MAX_LATITUDE = 90
export const MIN_LONGTITUDE = -180
export const MAX_LONGTITUDE = 180


export const LOCATION_CLOUD_PROVIDER_OPTIONS = [
  { value: 'Bare Metal', label: <FormattedMessage id="portal.network.locationForm.cloudProvider.bareMetal"/> }
]

export const LOCATION_CLOUD_PROVIDER_ID_OPTIONS = [
  { value: 'sl', label: <FormattedMessage id="portal.network.locationForm.cloudProvider.options.sl"/> },
  { value: 'do', label: <FormattedMessage id="portal.network.locationForm.cloudProvider.options.do"/> },
  { value: 'ec2',label: <FormattedMessage id="portal.network.locationForm.cloudProvider.options.ec2"/> }
]

export const NODE_TYPE_OPTIONS = [
  { value: 'sp_edge', label: <FormattedMessage id="portal.network.nodeForm.nodeType.sp_edge"/> },
  { value: 'udn_core', label: <FormattedMessage id="portal.network.nodeForm.nodeType.udn_core"/> }
]

export const NODE_ENVIRONMENT_OPTIONS = [
  { value: 'cdx-dev', cacheValue: 'cdx-dev', label: 'portal.network.nodeForm.environment.cdx-dev'},
  { value: 'cdx-test', cacheValue: 'cdx-test', label: 'portal.network.nodeForm.environment.cdx-test'},
  { value: 'cdx-stag', cacheValue: 'cdx-stag', label: 'portal.network.nodeForm.environment.cdx-stag'},
  { value: 'cdx', cacheValue: 'cdx', label: 'portal.network.nodeForm.environment.cdx'}
]

export const NODE_ROLE_OPTIONS = [
  { value: 'cache', label: 'portal.network.nodeForm.roles.cache'},
  { value: 'gslb', label: 'portal.network.nodeForm.roles.gslb'},
  { value: 'slb', label: 'portal.network.nodeForm.roles.slb'}
]

export const NODE_CLOUD_DRIVER_OPTIONS = [
  { value: 1, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.AmazonEC2"/> },
  { value: 2, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.digitalOcean"/> },
  { value: 3, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.SoftLayer"/> },
  { value: 4, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.OpenStack"/> },
  { value: 5, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.VMWare"/> },
  { value: 6, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.bareMetal"/> },
  { value: 7, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.LXC"/> },
  { value: 8, label: <FormattedMessage id="portal.network.nodeForm.cloudDriver.docker"/> }
]

export const NODE_TYPE_DEFAULT = 'udn_core'
export const NODE_ROLE_DEFAULT = 'cache'
export const NODE_ENVIRONMENT_DEFAULT = 'cdx'
export const NODE_CLOUD_DRIVER_DEFAULT = 6

export const FOOTPRINT_UDN_TYPES = [
  { value: 'billing_asn', label: <FormattedMessage id="portal.network.footprintForm.udn_type.billing_asn"/> },
  { value: 'on_net', label: <FormattedMessage id="portal.network.footprintForm.udn_type.on_net"/> },
  { value: 'off_net', label: <FormattedMessage id="portal.network.footprintForm.udn_type.off_net"/> }
]

export const FOOTPRINT_FILE_TYPES = ['text/csv', 'text/plain', '']
export const FOOTPRINT_CSV_TEMPLATE_PATH = "/assets/template.csv"
export const FOOTPRINT_FIELDS_NAME = ['name', 'description', 'data_type', 'value', 'udn_type']
export const FOOTPRINT_UND_TYPES_VALUES = ['billing_asn', 'on_net', 'off_net']
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

export const SALT_ROLE_OPTIONS = [
  {value: 'cache', label: 'portal.network.podForm.saltRole.options.cache.label'},
  {value: 'gslb', label: 'portal.network.podForm.saltRole.options.gslb.label'}
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
export const ASN_ITEMS_COUNT_TO_SEARCH = 5
export const ASN_STARTING_SEARCH_COUNT = 1
export const ASN_SEARCH_DELAY = 400

export const ROUTING_DEAMON_BGP_NAME_MIN_LEN = 1
export const ROUTING_DEAMON_BGP_NAME_MAX_LEN = 255
