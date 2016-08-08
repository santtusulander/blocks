import * as PERMISSIONS from '../constants/permissions'

let permissionMapping = {};

// This mapping connects permission constants to the permissions attached to roles.

// Sections
permissionMapping[PERMISSIONS.VIEW_ACCOUNT_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'account'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'analytics'])
permissionMapping[PERMISSIONS.VIEW_CONTENT_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'content'])
permissionMapping[PERMISSIONS.VIEW_SECURITY_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'security'])
permissionMapping[PERMISSIONS.VIEW_SERVICES_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'services'])
permissionMapping[PERMISSIONS.VIEW_SUPPORT_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'support'])

// Analytics Reports
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR] =
  (role) => role.getIn(['permissions', 'ui', 'analytics_file_error'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION] =
  (role) => role.getIn(['permissions', 'ui', 'analytics_sp_contribution'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET] =
  (role) => role.getIn(['permissions', 'ui', 'analytics_sp_on_off_net'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW] =
  (role) => role.getIn(['permissions', 'ui', 'analytics_traffic_overview'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS] =
  (role) => role.getIn(['permissions', 'ui', 'analytics_unique_visitors'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_URL] =
  (role) => role.getIn(['permissions', 'ui', 'analytics_url'])

// Misc Functionality
permissionMapping[PERMISSIONS.VIEW_PROPERTY_CONFIG] =
  (role) => role.getIn(['permissions', 'ui', 'config'])
permissionMapping[PERMISSIONS.DENY_ALWAYS] =
  () => false
permissionMapping[PERMISSIONS.ALLOW_ALWAYS] =
  () => true

// Content Item listing
permissionMapping[PERMISSIONS.VIEW_CONTENT_ACCOUNTS] =
  () => false
  // (role) => role.getIn(['aaa', 'accounts', 'list'])
permissionMapping[PERMISSIONS.VIEW_CONTENT_GROUPS] =
  (role) => role.getIn(['aaa', 'groups', 'list'])
permissionMapping[PERMISSIONS.VIEW_CONTENT_PROPERTIES] =
  (role) => role.getIn(['north', 'locations', 'list'])

/**
 * Determine if a user has a permission.
 * @param  {List}    roles       The roles list stored on the roles redux store.
 * @param  {Map}     user        The currentUser Map stored on the user redux store.
 * @param  {String}  permission  A constant from the permissions constants file.
 * @return {Boolean}             True if the user has permission, else false
 */
export default function checkPermissions(roles, user, permission) {
  const userRoles = user.get('roles')
  if (!userRoles) return false

  return userRoles.some(roleId => {
    const role = roles.get(roleId)
    if ( role ) return permissionMapping[permission](role)

    return false
  })
}
