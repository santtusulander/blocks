jest.unmock('../user-helpers')
jest.unmock('../local-storage')

import * as userHelpers from '../user-helpers'
import { setTokenMeta } from '../local-storage'

describe('User Helpers', () => {
  beforeEach(() => localStorage.clear())

  it('tokenDidExpire should return true if the user token has expired', () => {
    setTokenMeta({ expires_at: Math.floor(Date.now() / 1000) - 3600 })
    const tokenDidExpire = userHelpers.tokenDidExpire()
    expect(tokenDidExpire).toBe(true)
  })

  it('tokenDidExpire should return false if the user token has not expired', () => {
    setTokenMeta({ expires_at: Math.floor(Date.now() / 1000) + 3600 })
    const tokenDidExpire = userHelpers.tokenDidExpire()
    expect(tokenDidExpire).toBe(false)
  })

  it('tokenDidExpire should return true if there is no token meta data', () => {
    const tokenDidExpire = userHelpers.tokenDidExpire()
    expect(tokenDidExpire).toBe(true)
  })

  it('stripCountryCode should return a phone number without a country code', () => {
    const countryCode = '1'
    const fullPhoneNumber = `+${countryCode} 123-456-7890`
    const strippedPhoneNumber = userHelpers.stripCountryCode(fullPhoneNumber, countryCode)
    expect(strippedPhoneNumber).toBe(' 123-456-7890')
  })

  it('stripNonNumeric should remove non numeric characters', () => {
    const testString = `1abcdefghijklmnopqrstuvwxyz-!@#$%^&*()-=_+/\|{}[]<>,.?/:;"'~\``
    const strippedString = userHelpers.stripNonNumeric(testString)
    expect(strippedString).toBe('1')
  })
})
