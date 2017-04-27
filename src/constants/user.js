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

export const LANGUAGE_CODE_ENGLISH = 'en-US'
export const LANGUAGE_CODE_CHINESE = 'zh-CN'
export const LANGUAGE_CODE_SPANISH = 'es-ES'
export const LANGUAGE_CODE_FRENCH = 'fr-FR'

export const LANGUAGE_OPTIONS = [
  {value: LANGUAGE_CODE_ENGLISH, label: 'English(US)', secondLabel: 'EN'},
  {value: LANGUAGE_CODE_CHINESE, label: '中文', secondLabel: 'ZH'},
  {value: LANGUAGE_CODE_SPANISH, label: 'Español', secondLabel: 'ES'},
  {value: LANGUAGE_CODE_FRENCH, label: 'Françias', secondLabel: 'FR'}
]

export const DATE_FORMAT_OPTIONS = [
  {value: 'MM/DD/YYYY', label: 'MM/DD/YYYY'},
  {value: 'DD/MM/YYYY', label: 'DD/MM/YYYY'}
]
