import Immutable from 'immutable'
import React from 'react'
import { FormattedMessage } from 'react-intl'

export default [
  {
    value: 'traffic_high_to_low',
    label: <FormattedMessage id="portal.content.sortOrder.traffic_high_to_low"/>,
    path: Immutable.List(['dailyTraffic', 'totals', 'bytes', 'total']),
    direction: -1
  },
  {
    value: 'traffic_low_to_high',
    label: <FormattedMessage id="portal.content.sortOrder.traffic_low_to_high"/>,
    path: Immutable.List(['dailyTraffic', 'totals', 'bytes', 'total']),
    direction: 1
  },
  {
    value: 'name_a_to_z',
    label: <FormattedMessage id="portal.content.sortOrder.name_a_to_z"/>,
    path: Immutable.List(['item', 'name']),
    direction: 1
  },
  {
    value: 'name_z_to_a',
    label: <FormattedMessage id="portal.content.sortOrder.name_z_to_a"/>,
    path: Immutable.List(['item', 'name']),
    direction: -1
  }
]

/**
 * Number of Starbursts / page
 * @type {Number}
 */
export const PAGE_SIZE = 9

/**
 * Number of pagination links / paginator
 * @type {Number}
 */
export const MAX_PAGINATION_ITEMS = 6
