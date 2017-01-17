
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
  return phoneNumber.replace( new RegExp ( `^\\+${countryCode}` ), '')
}

/**
 * Strip all non-numemeric chars from string
 * @param  {String} numStr
 * @return {String} stripped
 */
export const stripNonNumeric = (numStr) => {
  return numStr.replace(/\D/g,'')
}
