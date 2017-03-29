export const ASPERA_DEFAULT_PORT = 33001
export const ASPERA_DEFAULT_HOST = 'cis-us-sjc-strg0-gtw1.cdx-dev.unifieddeliverynetwork.net'
export const ASPERA_DEFAULT_PATH = 'send'
export const ASPERA_DEFAULT_DESTINATION_ROOT = ''

export const STORAGE_WORKFLOW_DEFAULT = 'abr'
export const STORAGE_ABR_DEFAULT = false
export const STORAGE_ESTIMATE_DEFAULT = 100
export const STORAGE_ESTIMATE_MIN = 1
export const STORAGE_ESTIMATE_UNITS_DEFAULT = 'tb'
export const STORAGE_ESTIMATE_UNITS = [
  ['pb', 'PB'],
  ['tb', 'TB'],
  ['gb', 'GB'],
  ['mb', 'MB'],
  ['kb', 'KB'],
  ['b', 'B']
]
// Storage metrics shift time, need according to some delay
export const STORAGE_METRICS_SHIFT_TIME = 2
