import {
  PRIORITY_URGENT,
  PRIORITY_HIGHT,
  PRIORITY_NORMAL,
  PRIORITY_LOW,

  STATUS_NEW,
  STATUS_OPEN,
  STATUS_PENDING,
  STATUS_HOLD,
  STATUS_SOLVED,
  STATUS_CLOSED
} from '../constants/ticket'

export function getTicketPriorities() {
  return [
    PRIORITY_URGENT,
    PRIORITY_HIGHT,
    PRIORITY_NORMAL,
    PRIORITY_LOW
  ]
}

export function getTicketStatuses() {
  return [
    STATUS_NEW,
    STATUS_OPEN,
    STATUS_PENDING,
    STATUS_HOLD,
    STATUS_SOLVED,
    STATUS_CLOSED
  ]
}

export function getOpenTicketStatuses() {
  return [
    STATUS_NEW,
    STATUS_OPEN,
    STATUS_PENDING,
    STATUS_HOLD
  ]
}

export function getClosedTicketStatuses() {
  return [
    STATUS_SOLVED,
    STATUS_CLOSED
  ]
}

export function getTicketPriorityOptions() {
  return [
    { value: PRIORITY_URGENT, label: 'Urgent' },
    { value: PRIORITY_HIGHT, label: 'High' },
    { value: PRIORITY_NORMAL, label: 'Normal' },
    { value: PRIORITY_LOW, label: 'Low' },
  ]
}

export function getTicketStatusOptions() {
  return [
    { value: STATUS_NEW, label: 'New' },
    { value: STATUS_OPEN, label: 'Open' },
    { value: STATUS_PENDING, label: 'Pending' },
    { value: STATUS_HOLD, label: 'Hold' },
    { value: STATUS_SOLVED, label: 'Solved' },
    { value: STATUS_CLOSED, label: 'Closed' },
  ]
}
