import { List } from 'immutable'

export const PRIORITIES = List(['low', 'normal', 'high', 'urgent'])
export const STATUSES_OPEN = List(['new', 'open', 'pending', 'hold'])
export const STATUSES_CLOSED = List(['solved', 'closed'])
export const STATUSES = STATUSES_OPEN.concat(STATUSES_CLOSED)
