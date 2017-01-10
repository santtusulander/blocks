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
