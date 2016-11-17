
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
