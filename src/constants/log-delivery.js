
import React from 'react'
import { FormattedMessage } from 'react-intl'

export const LOG_TYPES_OPTIONS = [
  {value: "conductor", label: <FormattedMessage id="portal.services.logDelivery.logTypes.conductor.text" />, options: []}
]

export const FILE_FORMAT_OPTIONS = [
  {value: "zip", label: <FormattedMessage id="portal.services.logDelivery.fileFormat.zip.text" />}
]

export const AGGREGATION_INTERVAL_OPTIONS = [
  {value: 30, label: <FormattedMessage id="portal.services.logDelivery.aggregationInterval.30min.text" />}
]
