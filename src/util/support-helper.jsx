import React from 'react'
import { List } from 'immutable'
import classNames from 'classnames'
import IconIncident from '../components/shared/icons/icon-incident'
import IconProblem from '../components/shared/icons/icon-problem'
import IconQuestion from '../components/shared/icons/icon-question'
import IconTask from '../components/shared/icons/icon-task'
import { FormattedMessage } from 'react-intl'

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
    { value: PRIORITY_URGENT, label: <FormattedMessage id="portal.support.tickets.priority.urgent"/>, icon: getTicketPriorityIcon(PRIORITY_URGENT) },
    { value: PRIORITY_HIGHT, label: <FormattedMessage id="portal.support.tickets.priority.high"/>, icon: getTicketPriorityIcon(PRIORITY_HIGHT) },
    { value: PRIORITY_NORMAL, label: <FormattedMessage id="portal.support.tickets.priority.normal"/>, icon: getTicketPriorityIcon(PRIORITY_NORMAL) },
    { value: PRIORITY_LOW, label: <FormattedMessage id="portal.support.tickets.priority.low"/>, icon: getTicketPriorityIcon(PRIORITY_LOW) }
  ]
}

export function getTicketStatusOptions() {
  return [
    { value: STATUS_NEW, label: <FormattedMessage id="portal.support.tickets.status.new"/> },
    { value: STATUS_OPEN, label: <FormattedMessage id="portal.support.tickets.status.open"/> },
    { value: STATUS_PENDING, label: <FormattedMessage id="portal.support.tickets.status.pending"/> },
    { value: STATUS_HOLD, label: <FormattedMessage id="portal.support.tickets.status.hold"/> },
    { value: STATUS_SOLVED, label: <FormattedMessage id="portal.support.tickets.status.solved"/> },
    { value: STATUS_CLOSED, label: <FormattedMessage id="portal.support.tickets.status.closed"/> }
  ]
}

export function getTicketTypeOptions() {
  return [
    { value: TYPE_PROBLEM, label: <FormattedMessage id="portal.support.tickets.type.problem"/>, icon: getTicketTypeIcon(TYPE_PROBLEM) },
    { value: TYPE_INCIDENT, label: <FormattedMessage id="portal.support.tickets.type.incident"/>, icon: getTicketTypeIcon(TYPE_INCIDENT) },
    { value: TYPE_QUESTION, label: <FormattedMessage id="portal.support.tickets.type.question"/>, icon: getTicketTypeIcon(TYPE_QUESTION) },
    { value: TYPE_TASK, label: <FormattedMessage id="portal.support.tickets.type.task"/>, icon: getTicketTypeIcon(TYPE_TASK) }
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
