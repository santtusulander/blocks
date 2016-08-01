import * as PERMISSIONS from '../constants/permissions'

let permissionMapping = {};

// This mapping connects permission constants to the permissions attached to roles.
permissionMapping[PERMISSIONS.VIEW_CONTENT_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'content'])

/**
 * Determine if a user has a permission.
 * @param  {List}    roles       The roles list stored on the roles redux store.
 * @param  {Map}     user        The currentUser Map stored on the user redux store.
 * @param  {String}  permission  A constant from the permissions constants file.
 * @return {Boolean}             True if the user has permission, else false
 */
export default function checkPermissions(roles, user, permission) {
  let userRoles = user.get('roles');
  return userRoles.some(roleId => permissionMapping[permission](roles.get(roleId)))
}
