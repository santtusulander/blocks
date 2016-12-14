import * as PERMISSIONS from '../constants/permissions'
import {
  ROLES_MAPPING,
  ACCOUNT_TYPE_CLOUD_PROVIDER
} from '../constants/account-management-options'

let permissionMapping = {};

// This mapping connects permission constants to the permissions attached to roles.

// Sections
permissionMapping[PERMISSIONS.VIEW_ACCOUNT_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'account'])
permissionMapping[PERMISSIONS.VIEW_ACCOUNT_DETAIL] =
  (userRole) => {
    const role = ROLES_MAPPING.find(role => role.id === userRole.get('id'))
    const roleIsCloudProvider = role.accountTypes.indexOf(ACCOUNT_TYPE_CLOUD_PROVIDER) >= 0
    return !roleIsCloudProvider
  }
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'analytics'])
permissionMapping[PERMISSIONS.VIEW_CONTENT_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'content'])
// TODO: UDNP-1726 -- change to 'permissions.ui.network' after CS-439 is complete
permissionMapping[PERMISSIONS.VIEW_NETWORK_SECTION] =
  (role) => role.getIn(['permissions', 'ui', 'content'])
// TODO: UDNP-1726 -- change to 'permissions.ui.dashboard' after CS-439 is complete
permissionMapping[PERMISSIONS.VIEW_DASHBOARD_SECTION] =
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
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_CACHE_HIT_RATE] =
  (role) => role.getIn(['permissions', 'ui', 'analytics_daily_cache_hit_rate'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_PLAYBACK_DEMO] =
  (role) => role.getIn(['permissions', 'ui', 'playback_demo'])

// Misc Functionality
permissionMapping[PERMISSIONS.VIEW_PROPERTY_CONFIG] =
  (role) => role.getIn(['permissions', 'ui', 'config'])
permissionMapping[PERMISSIONS.DENY_ALWAYS] =
  () => false
permissionMapping[PERMISSIONS.ALLOW_ALWAYS] =
  () => true
permissionMapping[PERMISSIONS.VIEW_PROPERTY_PURGE_STATUS] =
  (role) => role.getIn(['permissions', 'north', 'purge_many', 'list', 'allowed'])

// Content Item listing
permissionMapping[PERMISSIONS.VIEW_CONTENT_ACCOUNTS] =
  (role) => {
    // TODO: This role check was implemented to fix UDNP-1556.
    // This is a temporary fix and is definitely considered a hack. We should never
    // do role checking in our permission mapping functions. This should be removed
    // once we come up with a better way to support listing accounts for the
    // contribution report post 1.0.1. The work to fix this is tracked by UDNP-1557.
    let isSuperAdmin = role.get('id') === 1 // NOTE: 1 is the role ID for UDN Admins
    let canListAccounts = role.getIn(['permissions', 'aaa', 'accounts', 'list', 'allowed'], false)
    return isSuperAdmin && canListAccounts
  }
permissionMapping[PERMISSIONS.VIEW_CONTENT_GROUPS] =
  (role) => role.getIn(['permissions', 'aaa', 'groups', 'list', 'allowed'])
permissionMapping[PERMISSIONS.VIEW_CONTENT_PROPERTIES] =
  (role) => role.getIn(['permissions', 'north', 'published_hosts', 'list', 'allowed'])

// Account Permissions
permissionMapping[PERMISSIONS.MODIFY_ACCOUNTS] =
  (role) => role.getIn(['permissions', 'aaa', 'accounts', 'modify', 'allowed'])

// Group Permissions
permissionMapping[PERMISSIONS.CREATE_GROUP] =
  (role) => role.getIn(['permissions', 'aaa', 'groups', 'create', 'allowed'])
permissionMapping[PERMISSIONS.MODIFY_GROUP] =
  (role) => role.getIn(['permissions', 'aaa', 'groups', 'modify', 'allowed'])

// Users Permissions
permissionMapping[PERMISSIONS.CREATE_USER] =
  (role) => role.getIn(['permissions', 'aaa', 'users', 'create', 'allowed'])
permissionMapping[PERMISSIONS.MODIFY_USER] =
  (role) => role.getIn(['permissions', 'aaa', 'users', 'modify', 'allowed'])


// DNS permissions
// Need role.permissions.zones.list.allowed AND role.permissions.rr.list.allowed

permissionMapping[PERMISSIONS.VIEW_DNS] =
  (role) => role.getIn(['permissions', 'north', 'zones', 'list', 'allowed']) && role.getIn(['permissions', 'north', 'rr', 'list', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_ZONE] =
  (role) => role.getIn(['permissions', 'north', 'zones', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_ZONE] =
  (role) => role.getIn(['permissions', 'north', 'zones', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_ZONE] =
  (role) => role.getIn(['permissions', 'north', 'zones', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_RECORD] =
  (role) => role.getIn(['permissions', 'north', 'rr', 'create', 'allowed'])

//Security permissions
permissionMapping[PERMISSIONS.DELETE_CERTIFICATE] =
  (role) => role.getIn(['permissions', 'north', 'certs', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_CERTIFICATE] =
  (role) => role.getIn(['permissions', 'north', 'certs', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_CERTIFICATE] =
  (role) => role.getIn(['permissions', 'north', 'certs', 'modify', 'allowed'])

//Published Host permissions
permissionMapping[PERMISSIONS.DELETE_PROPERTY] =
  (role) => role.getIn(['permissions', 'north', 'published_hosts', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_PROPERTY] =
  (role) => role.getIn(['permissions', 'north', 'published_hosts', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_PROPERTY] =
  (role) => role.getIn(['permissions', 'north', 'published_hosts', 'modify', 'allowed'])


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
    const role = roles.find(role => role.get('id') === roleId)
    if ( role ) return permissionMapping[permission](role)

    return false
  })
}
