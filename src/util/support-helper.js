import { List } from 'immutable'
import IconIncident from '../components/icons/icon-incident'
import IconProblem from '../components/icons/icon-problem'
import IconQuestion from '../components/icons/icon-question'
import IconTask from '../components/icons/icon-task'

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
  STATUS_CLOSED,

  TYPE_PROBLEM,
  TYPE_INCIDENT,
  TYPE_QUESTION,
  TYPE_TASK,
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

export function getTicketTypes() {
  return [
    TYPE_PROBLEM,
    TYPE_INCIDENT,
    TYPE_QUESTION,
    TYPE_TASK,
  ]
}

export function isStatusOpen(status) {
  return List(getOpenTicketStatuses()).includes(status.toLowerCase())
}

export function isStatusClosed(status) {
  return List(getClosedTicketStatuses()).includes(status.toLowerCase())
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

export function getTicketTypeOptions() {
  return [
    { value: TYPE_PROBLEM, label: 'Problem', icon: getTicketTypeIcon(TYPE_PROBLEM) },
    { value: TYPE_INCIDENT, label: 'Incident', icon: getTicketTypeIcon(TYPE_INCIDENT) },
    { value: TYPE_QUESTION, label: 'Question', icon: getTicketTypeIcon(TYPE_QUESTION) },
    { value: TYPE_TASK, label: 'Task', icon: getTicketTypeIcon(TYPE_TASK) },
  ]
}

export function getTicketTypeIcon(type) {
  switch (type) {
    case TYPE_PROBLEM:
      return IconProblem
    case TYPE_INCIDENT:
      return IconIncident
    case TYPE_QUESTION:
      return IconQuestion
    case TYPE_TASK:
      return IconTask
    default:
      return null
  }
}

