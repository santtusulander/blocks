export const STORAGE_LOCATIONS = [
  {label: "San Jose, California, USA", value: 1, options: []},
  {label: "Frankfurkt, Germany", value: 2, options: []},
  {label: "Hong Kong, China", value: 3, options: []}
]

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

/*
  TODO: change this to be fetched from the API.
  UDNP-2832 - Integrate CIS Storage configuration form with the redux
*/
export const STORAGE_ABR_PROFILES = [
    ["abr_tv_16_9_high", "ABR dynamic packager - Smart TV - 16x9, high bitrate"],
    ["abr_pc_16_9_mid", "ABR dynamic packager - PC Player - 16x9, middle bitrate"],
    ["abr_mobile_16_9_low", "ABR dynamic packager - Mobile Player - 16x9, low bitrate"],
    ["abr_tablet_4_3_high", "ABR dynamic packager - Tablet Player - 4x3, high bitrate"],
    ["abr_sd_4_3_low", "ABR dynamic packager - SD - 4x3, low bitrate"]
]
