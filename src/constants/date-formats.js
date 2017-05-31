export const DATE_FORMATS = {
  DATE_HOUR: 'dateHour',
  DATE_HOUR_UTC: 'dateHourUTC',
  DATE_HOUR_12: 'dateHour12',
  DATE_HOUR_12_SHORT: 'dateHour12Short',
  DATE_HOUR_24: 'dateHour24',
  FULL_DATE: 'fullDate',
  FULL_DATE_SHORT: 'fullDateShort',
  FULL_DATE_UTC: 'fullDateUTC',
  MONTH_LONG_YEAR_UTC: 'monthLongYearUTC',
  DAY_MONTH_SHORT_HOUR: 'dayMonthShortHour'
}

export const TIME_FORMATS = {
  TIME_12_UTC: 'time12UTC',
  TIME_24_UTC: 'time24UTC',
  TIME_12: 'time12',
  TIME_24: 'time24'
}

export const getDateFormats = (timezone) => {
  return {
    date: {
      [DATE_FORMATS.DATE_HOUR]: {       // DD/MM/YYYY HH:MM Z
        timeZone: timezone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      },
      [DATE_FORMATS.DATE_HOUR_UTC]: {       // DD/MM/YYYY, HH:MM (UTC)
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.DATE_HOUR_12]: {                  // DD/MM/YYYY, HH:MM A
        timeZone: timezone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.DATE_HOUR_12_SHORT]: {           // D MMM YYYY, HH:MM A
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.DATE_HOUR_24]: {                  // DD/MM/YYYY, HH:MM
        timeZone: timezone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      },
      [DATE_FORMATS.FULL_DATE]: {                    // DD/MM/YYYY
        timeZone: timezone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      },
      [DATE_FORMATS.FULL_DATE_SHORT]: {             // D MMM YYYY
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      [DATE_FORMATS.FULL_DATE_UTC]: {              // DD/MM/YYYY  (UTC)
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      },
      [DATE_FORMATS.MONTH_LONG_YEAR_UTC]: {        // MMMM YYYY
        month: 'long',
        year: 'numeric'
      },
      [DATE_FORMATS.DAY_MONTH_SHORT_HOUR]: {      // D MMM, h:mm
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
        hour12: false,
        hour: 'numeric',
        minute: '2-digit'
      }
    },
    time: {
      [TIME_FORMATS.TIME_24_UTC]: {                    // HH:MM (UTC)
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      [TIME_FORMATS.TIME_12_UTC]: {                    // HH:MM A (UTC)
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      [TIME_FORMATS.TIME_24]: {                    // HH:MM
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      [TIME_FORMATS.TIME_12]: {                    // HH:MM A
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    }
  }
}
