import { formatDate } from '../../util/helpers'
/**
 * Get label for traffic (returns label or MM/DD/YYY - MM/DD/YYY if custom range)
 * @param  {Map} dateRange      dateRange Map({startDate: xxx, endDate: yyy})
 * @param  {string} dateRangeLabel labelId
 * @param  {function} formatMessage  react-intl formatMessage
 * @return {string}       label
 */
export const getTrafficByDateRangeLabel = (dateRange, dateRangeLabel, formatMessage) => {
  let label = ''
  if (dateRangeLabel === 'portal.constants.date-ranges.custom_timerange' || !dateRangeLabel) {
    const startDate = formatDate(dateRange.get('startDate', 'MM/DD/YYYY'))
    const endDate = formatDate(dateRange.get('endDate'), 'MM/DD/YYYY')
    label = startDate + (startDate !== endDate ? ` - ${endDate}` : '')
  } else {
    label = `${formatMessage({ id: dateRangeLabel })}`
  }
  return label
}
