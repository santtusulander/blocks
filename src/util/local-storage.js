const LOCALSTORAGE_USER_TOKEN = 'EricssonUDNUserToken'
const LOCALSTORAGE_USER_TOKEN_META = 'EricssonUDNUserTokenMeta'
const LOCALSTORAGE_USER_NAME = 'EricssonUDNUserName'
const LOCALSTORAGE_UI_THEME = 'EricssonUDNUiTheme'

/**
 * Check whether LocalStorage is supported.
 * Should be called only once.
 *
 * @return {Boolean}
 */
export const isLocalStorageSupported = () => {
  const testKey = 'test'

  try {
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)

    return true

  } catch (error) {

    Storage.prototype.setItem = () => {}
    Storage.prototype.getItem = () => {}
    Storage.prototype.removeItem = () => {}

    return false
  }
}

/**
 * Set User token to localStorage
 * @type {String}
 */
export const setUserToken = (token) => {
  localStorage.setItem(LOCALSTORAGE_USER_TOKEN, token)
}

/**
 * Get User token from localStorage
 * @return {String}
 */
export const getUserToken = () => {
  return localStorage.getItem(LOCALSTORAGE_USER_TOKEN)
}

/**
 * Delete User Token from localStorage
 * @return {[type]} [description]
 */
export const deleteUserToken = () => {
  localStorage.removeItem(LOCALSTORAGE_USER_TOKEN)
}

/**
 * setTokenMeta to localStorage
 * @param {Object} tokenMeta
 */
export const setTokenMeta = ( tokenMeta ) => {
  localStorage.setItem(LOCALSTORAGE_USER_TOKEN_META, JSON.stringify(tokenMeta))
}

/**
 * getTokenMeta from localStorage
 * @return {Object}
 */
export const getTokenMeta = () => {
  return JSON.parse( localStorage.getItem(LOCALSTORAGE_USER_TOKEN_META) || '{}')
}

/**
 * Delete Token Meta from localStorage
 * @return {[type]} [description]
 */
export const deleteTokenMeta = () => {
  localStorage.removeItem(LOCALSTORAGE_USER_TOKEN_META)
}

/**
 * Set theme in localStorage
 * @param {String} theme
 */
export const setUITheme = (theme) => {
  localStorage.setItem(LOCALSTORAGE_UI_THEME, theme)
}

/**
 * Get theme from localStorage
 * @return {String} theme
 */
export const getUITheme = () => {
  return localStorage.getItem(LOCALSTORAGE_UI_THEME)
}

/**
 * delete ui theme from localStorage
 *
 */
export const deleteUITheme = () => {
  localStorage.removeItem(LOCALSTORAGE_UI_THEME)
}

/**
 * Set userName in localStorage
 * @param {String} userName
 */
export const setUserName = (userName) => {
  localStorage.setItem(LOCALSTORAGE_USER_NAME, userName)
}

/**
 * get UserName from localStorage]
 * @return {String} userName
 */
export const getUserName = () => {
  return localStorage.getItem(LOCALSTORAGE_USER_NAME)
}

/**
 * Delete userName from localStorage
 *
 */
export const deleteUserName = () => {
  localStorage.removeItem(LOCALSTORAGE_USER_NAME)
}
