export const dateFormats = (timezone) => {
  return {
    date: {
      'day_num_month_num': {  // 11/11
        timeZone: timezone,
        day: 'numeric',
        month: 'numeric'
      },
      'day_num_month_long': { // 11 November
        timeZone: timezone,
        day: 'numeric',
        month: 'long'
      },
      'datenum': {           // 11/11/2011
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric'
      },
      'datehour24': {         // 11/11/2011, 23:11
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      },
      'datehour12': {         // 11/11/2011, 23:11
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      },
      'dateInUTC': {       // 11/11/2011  (UTC)
        timeZone: 'UTC',
        day: '2-digit',
        month: 'numeric',
        year: 'numeric'
      },
      'datehourInUTC': {       // 11/11/2011, 11:11 (UTC)
        timeZone: 'UTC',
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      },
      'datehourTimezone': {       // 11 11 2011, 11:11 EDT
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }
    },
    time: {
      time24: {                    // 23:11
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      time12: {                    // 11:11 PM
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    }
  }
}
