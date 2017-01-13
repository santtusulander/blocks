
/**
 * Builds Select compatible option list from users roles.
 * @param user
 * @returns {Array}
 */
export function getRoleSelectOptions(user) {
  let options = []

  user.get('roles').forEach(role => {
    options.push([role, role])
  })

  return options
}

/**
 * Strip countryCode from the beginning of the phoneNumber
 * @param  {String} phoneNumber
 * @param  {String} countryCode
 * @return {String} phone number without countryCode
 */
export const stripCountryCode = (phoneNumber, countryCode) => {
  return phoneNumber.replace( new RegExp ( `^\\+${countryCode} ` ), '')
}

/**
 * Strip all non-numemeric chars from string
 * @param  {String} numStr
 * @return {String} stripped
 */
export const stripNonNumeric = (numStr) => {
  return numStr.replace(/\D/g,'')
}


/**
 * Checks if currentUnixTime > token expires_at (from localStorage)
 * @return {Boolean}
 */
export const tokenDidExpire = () => {
  //TODO: UDNP-2308 Make this use use localStorage - methods after UDNP-2304 is merged
  const tokenMeta = JSON.parse(localStorage.getItem( 'EricssonUDNUserTokenMeta')||{})
  const expiresAt = tokenMeta.expires_at
  const currentUnixTime = Math.floor(Date.now() / 1000)

  if (currentUnixTime > expiresAt) return true

  return false
}
