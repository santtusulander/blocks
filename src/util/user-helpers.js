
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
 * Checks if the given user has the given role
 * @param user
 * @param role
 * @returns {boolean}
 */
export function hasRole(user, role) {
  let hasRole = false

  user.get('roles').forEach(role => {
    if (role === role) {
      hasRole = true
    }
  })

  return hasRole
}
