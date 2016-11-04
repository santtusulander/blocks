import moment from 'moment'

/**
 * Get label for traffic (returns label or MM/DD/YYY - MM/DD/YYY if custom range)
 * @param  {Map} dateRange      dateRange Map({startDate: xxx, endDate: yyy})
 * @param  {string} dateRangeLabel labelId
 * @param  {function} formatMessage  react-intl formatMessage
 * @return {string}       label
 */
export const getTrafficByDateRangeLabel = (dateRange, dateRangeLabel, formatMessage) => {
  return ( dateRangeLabel === 'portal.constants.date-ranges.custom_timerange' ||  !dateRangeLabel )
  ? `${moment(dateRange.get('startDate')).format('MM/DD/YYYY')} - ${moment(dateRange.get('endDate')).format('MM/DD/YYYY')}`
  : `${formatMessage({id: dateRangeLabel})}`
}
