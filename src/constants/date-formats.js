export const DATE_FORMATS = {
  DAY_MONTH: 'dayMonth',
  DAY_MONTH_LONG: 'dayMonthLong',
  DATE_HOUR: 'dateHour',
  DATE_HOUR_12: 'dateHour12',
  DATE_HOUR_12_SHORT: 'dateHour12Short',
  DATE_HOUR_24: 'dateHour24',
  DATE_HOUR_UTC: 'dateHourUTC',
  MONTH_LONG_YEAR_UTC: 'monthLongYearUTC',
  FULL_DATE: 'fullDate',
  FULL_DATE_SHORT: 'fullDateShort',
  FULL_DATE_UTC: 'fullDateUTC'
}

export const TIME_FORMATS = {
  TIME_12_UTC: 'time12UTC',
  TIME_24_UTC: 'time24UTC'
}
export const getDateFormats = (timezone) => {
  return {
    date: {
      [DATE_FORMATS.DAY_MONTH]: {  // 11/11
        timeZone: timezone,
        day: 'numeric',
        month: 'numeric'
      },
      [DATE_FORMATS.DAY_MONTH_LONG]: { // 11 November
        timeZone: timezone,
        day: 'numeric',
        month: 'long'
      },
      [DATE_FORMATS.DAY_MONTH_SHORT_HOUR]: { // 3 Nov, 1:11
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
        hour12: false,
        hour: 'numeric',
        minute: '2-digit'
      },
      [DATE_FORMATS.FULL_DATE_SHORT]: {           // 1 Nov 2011
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      [DATE_FORMATS.FULL_DATE]: {           // 11/11/2011
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric'
      },
      [DATE_FORMATS.DATE_HOUR_24]: {         // 11/11/2011, 23:11
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.DATE_HOUR_12]: {         // 11/11/2011, 11:11 PM
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.DATE_HOUR_12_SHORT]: {         // 1 Nov 2011, 11:11 PM
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.DATE_HOUR_UTC]: {       // 11/11/2011, 11:11 (UTC)
        timeZone: 'UTC',
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.DATE_HOUR]: {       // 11 11 2011, 11:11 EDT
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      },
      [DATE_FORMATS.MONTH_LONG_YEAR_UTC]: {
        month: 'long',
        year: 'numeric'
      },
      [DATE_FORMATS.FULL_DATE_UTC]: {       // 11/11/2011  (UTC)
        timeZone: 'UTC',
        day: '2-digit',
        month: 'numeric',
        year: 'numeric'
      }
    },
    time: {
      [TIME_FORMATS.TIME_24_UTC]: {                    // 23:11
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      [TIME_FORMATS.TIME_12_UTC]: {                    // 11:11 PM
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      [TIME_FORMATS.TIME_24]: {                    // 23:11
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      [TIME_FORMATS.TIME_12]: {                    // 11:11 PM
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    }
  }
}
