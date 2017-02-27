jest.unmock('../local-storage')
import * as localStorageUtils from '../local-storage'

const TEST_TOKEN = 'test_token'
const TEST_TOKEN_META = {token: TEST_TOKEN}
const TEST_THEME = 'dark'
const TEST_USERNAME = 'bryan@idean.com'

describe('Local Storage Utils', () => {
  beforeEach(() => localStorage.clear())

  it('should set user tokens', () => {
    localStorageUtils.setUserToken(TEST_TOKEN)
    let tokenValue = localStorageUtils.getUserToken()
    expect(tokenValue).toBe(TEST_TOKEN)
  })

  it('should delete user tokens', () => {
    localStorageUtils.setUserToken(TEST_TOKEN)
    localStorageUtils.deleteUserToken()
    let tokenValue = localStorageUtils.getUserToken()
    expect(tokenValue).toBe(null)
  })

  it('should set token meta data', () => {
    localStorageUtils.setTokenMeta(TEST_TOKEN_META)
    let tokenMetaValue = localStorageUtils.getTokenMeta()
    expect(tokenMetaValue).toEqual(TEST_TOKEN_META)
  })

  it('should delete token meta data', () => {
    localStorageUtils.setTokenMeta(TEST_TOKEN_META)
    localStorageUtils.deleteTokenMeta()
    let tokenMetaValue = localStorageUtils.getTokenMeta()
    expect(tokenMetaValue).toEqual({})
  })

  it('should set UI theme', () => {
    localStorageUtils.setUITheme(TEST_THEME)
    let uiTheme = localStorageUtils.getUITheme()
    expect(uiTheme).toBe(TEST_THEME)
  })

  it('should delete UI theme', () => {
    localStorageUtils.setUITheme(TEST_THEME)
    localStorageUtils.deleteUITheme()
    let uiTheme = localStorageUtils.getUITheme()
    expect(uiTheme).toBe(null)
  })

  it('should set username', () => {
    localStorageUtils.setUserName(TEST_USERNAME)
    let username = localStorageUtils.getUserName()
    expect(username).toBe(TEST_USERNAME)
  })

  it('should delete username', () => {
    localStorageUtils.setUserName(TEST_USERNAME)
    localStorageUtils.deleteUserName()
    let username = localStorageUtils.getUserName()
    expect(username).toBe(null)
  })
})
