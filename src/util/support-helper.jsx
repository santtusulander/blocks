import React from 'react'
import { List } from 'immutable'
import classNames from 'classnames'
import IconIncident from '../components/shared/icons/icon-incident'
import IconProblem from '../components/shared/icons/icon-problem'
import IconQuestion from '../components/shared/icons/icon-question'
import IconTask from '../components/shared/icons/icon-task'

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
  TYPE_TASK
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
    TYPE_TASK
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
    { value: PRIORITY_URGENT, label: 'Urgent', icon: getTicketPriorityIcon(PRIORITY_URGENT) },
    { value: PRIORITY_HIGHT, label: 'High', icon: getTicketPriorityIcon(PRIORITY_HIGHT) },
    { value: PRIORITY_NORMAL, label: 'Normal', icon: getTicketPriorityIcon(PRIORITY_NORMAL) },
    { value: PRIORITY_LOW, label: 'Low', icon: getTicketPriorityIcon(PRIORITY_LOW) }
  ]
}

export function getTicketStatusOptions() {
  return [
    { value: STATUS_NEW, label: 'New' },
    { value: STATUS_OPEN, label: 'Open' },
    { value: STATUS_PENDING, label: 'Pending' },
    { value: STATUS_HOLD, label: 'Hold' },
    { value: STATUS_SOLVED, label: 'Solved' },
    { value: STATUS_CLOSED, label: 'Closed' }
  ]
}

export function getTicketTypeOptions() {
  return [
    { value: TYPE_PROBLEM, label: 'Problem', icon: getTicketTypeIcon(TYPE_PROBLEM) },
    { value: TYPE_INCIDENT, label: 'Incident', icon: getTicketTypeIcon(TYPE_INCIDENT) },
    { value: TYPE_QUESTION, label: 'Question', icon: getTicketTypeIcon(TYPE_QUESTION) },
    { value: TYPE_TASK, label: 'Task', icon: getTicketTypeIcon(TYPE_TASK) }
  ]
}

// eslint-disable-next-line react/display-name
export function getTicketTypeIcon(type) {
  switch (type) {
    case TYPE_PROBLEM:
      return <IconProblem />
    case TYPE_INCIDENT:
      return <IconIncident />
    case TYPE_QUESTION:
      return <IconQuestion />
    case TYPE_TASK:
      return <IconTask />
    default:
      return null
  }
}

// eslint-disable-next-line react/no-multi-comp, react/display-name
export function getTicketPriorityIcon(priority) {
  const className = classNames('support-ticket__priority-icon', {
    [`support-ticket__priority-icon--${priority.toLowerCase()}`]: true
  })

  return (<div className={className} />)
}

export function getTicketPriorityLabel(priority) {
  const options = List(getTicketPriorityOptions())

  const option = options.find((single_option) => {
    return single_option.value === priority
  })

  return option.label
}

export function getTicketTypeLabel(type) {
  const options = List(getTicketTypeOptions())

  const option = options.find((single_option) => {
    return single_option.value === type
  })

  return option.label
}
