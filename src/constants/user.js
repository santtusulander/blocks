export const AUTHY_APP_DOWNLOAD_LINK = 'https://www.authy.com/app/'
export const TWO_FA_DEFAULT_AUTH_METHOD = 'app'
export const TWO_FA_METHODS_OPTIONS = [
  {
    value: 'sms',
    intl_label: 'portal.user.edit.2FA.method.sms.label.text'
  },
  {
    value: 'app',
    intl_label: 'portal.user.edit.2FA.method.app.label.text'
  },
  // UDNP-2268 - Need to remove "Voice Call"
  //             verification method from 2FA feature
  // {
  //   value: 'call',
  //   intl_label: 'portal.user.edit.2FA.method.call.label.text'
  // },
  {
    value: 'one_touch',
    intl_label: 'portal.user.edit.2FA.method.one_touch.label.text'
  }
]

export const LANGUAGE_CODE_ENGLISH_US = 'en-US'
export const LANGUAGE_CODE_ENGLISH_GB = 'en-GB'
export const LANGUAGE_CODE_CHINESE = 'zh-CN'
export const LANGUAGE_CODE_SPANISH = 'es-ES'
export const LANGUAGE_CODE_FRENCH = 'fr-FR'

export const LANGUAGE_OPTIONS = [
  {value: LANGUAGE_CODE_ENGLISH_US, label: 'English(US)', secondLabel: 'EN'},
  {value: LANGUAGE_CODE_ENGLISH_GB, label: 'English(GB)', secondLabel: 'EN'},
  {value: LANGUAGE_CODE_CHINESE, label: '中文', secondLabel: 'ZH'},
  {value: LANGUAGE_CODE_SPANISH, label: 'Español', secondLabel: 'ES'},
  {value: LANGUAGE_CODE_FRENCH, label: 'Françias', secondLabel: 'FR'}
]

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
      'datehour': {         // 11/11/2011, 23:11
        timeZone: timezone,
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour12: false,
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
    }
  }
}
