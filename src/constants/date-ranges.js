import moment from 'moment-timezone'

export default {
  MONTH_TO_DATE: 'portal.constants.date-ranges.month_to_date',
  LAST_28: 'portal.constants.date-ranges.last_28',
  LAST_MONTH: 'portal.constants.date-ranges.last_month',
  THIS_WEEK: 'portal.constants.date-ranges.this_week',
  LAST_WEEK: 'portal.constants.date-ranges.last_week',
  TODAY: 'portal.constants.date-ranges.today',
  YESTERDAY: 'portal.constants.date-ranges.yesterday',
  CUSTOM_TIMERANGE: 'portal.constants.date-ranges.custom_timerange'
}

export const startOfThisMonth = () => moment().startOf('month')
export const startOfThisDay = () => moment().startOf('day')
export const endOfThisDay = () => moment().endOf('day')
export const startOfLastMonth = () => startOfThisMonth().subtract(1, 'month')
export const endOfLastMonth = () => moment().subtract(1, 'month').endOf('month')
export const startOfLast28 = () => endOfThisDay().add(1,'second').subtract(28, 'days')
export const startOfLastWeek = () => moment().startOf('week').subtract(1, 'week')
export const endOfLastWeek = () => moment().endOf('week').subtract(1, 'week')
export const startOfThisWeek = () => moment().startOf('week')
export const endOfThisWeek = () => moment().endOf('week')
