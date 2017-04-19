import Immutable from 'immutable'

export default [
  {
    value: 'traffic_high_to_low',
    label: 'High to Low',
    path: Immutable.List(['dailyTraffic', 'totals', 'bytes', 'total']),
    direction: -1
  },
  {
    value: 'traffic_low_to_high',
    label: 'Low to High',
    path: Immutable.List(['dailyTraffic', 'totals', 'bytes', 'total']),
    direction: 1
  },
  {
    value: 'name_a_to_z',
    label: 'Name A to Z',
    path: Immutable.List(['item', 'name']),
    direction: 1
  },
  {
    value: 'name_z_to_a',
    label: 'Name Z to A',
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
