import React from 'react'
import { FormattedMessage } from 'react-intl'

export const STORAGE_LOCATIONS = [
  {"label": "San Jose, California, USA", value: 1, "options": []},
  {"label": "Frankfurkt, Germany", value: 2, "options": []},
  {"label": "Hong Kong, China", value: 3, "options": []}
]

export const STORAGE_ABR_DEFAULT = true
export const STORAGE_ESTIMATE_DEFAULT = "100"
export const STORAGE_ESTIMATES_METRIC_DEFAULT = 'tb'
export const STORAGE_ESTIMATE_METRICS = [
  ['tb', <FormattedMessage id="portal.storage.storageForm.terrabyte.text"/>],
  ['gb', <FormattedMessage id="portal.storage.storageForm.gigabyte.text"/>],
  ['mb', <FormattedMessage id="portal.storage.storageForm.megabyte.text"/>]
]

export const STORAGE_ABR_PROFILES = [
    ["abr_tv_16_9_high", "ABR dynamic packager - Smart TV - 16x9, high bitrate"],
    ["abr_pc_16_9_mid", "ABR dynamic packager - PC Player - 16x9, middle bitrate"],
    ["abr_mobile_16_9_low", "ABR dynamic packager - Mobile Player - 16x9, low bitrate"],
    ["abr_tablet_4_3_high", "ABR dynamic packager - Tablet Player - 4x3, high bitrate"],
    ["abr_sd_4_3_low", "ABR dynamic packager - SD - 4x3, low bitrate"]
]
