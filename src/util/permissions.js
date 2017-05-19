import * as PERMISSIONS from '../constants/permissions'
import {
  ROLES_MAPPING,
  ACCOUNT_TYPE_CLOUD_PROVIDER,
  UDN_ADMIN_ROLE_ID,
  SUPER_ADMIN_ROLE_ID,
  UDN_USER_ROLE_ID
} from '../constants/account-management-options'

const permissionMapping = {};

// This mapping connects permission constants to the permissions attached to roles.

// Sections
permissionMapping[PERMISSIONS.VIEW_ACCOUNT_SECTION] =
  (role) => role.getIn([ 'ui', 'account'])
permissionMapping[PERMISSIONS.VIEW_ACCOUNT_DETAIL] =
  (userRole, roleId) => {
    //TODO: refactor, this is not reliable
    const role = ROLES_MAPPING.find(mapping_role => mapping_role.id === roleId)
    const roleIsCloudProvider = role.accountTypes.indexOf(ACCOUNT_TYPE_CLOUD_PROVIDER) >= 0
    return !roleIsCloudProvider
  }
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_SECTION] =
  (role) => role.getIn([ 'ui', 'analytics'])
permissionMapping[PERMISSIONS.VIEW_CONTENT_SECTION] =
  (role) => role.getIn([ 'ui', 'content'])
// TODO: UDNP-1726 -- change to 'permissions.ui.network' after CS-439 is complete
permissionMapping[PERMISSIONS.VIEW_NETWORK_SECTION] =
  (role) => role.getIn([ 'ui', 'content'])
// TODO: UDNP-1726 -- change to 'permissions.ui.dashboard' after CS-439 is complete
permissionMapping[PERMISSIONS.VIEW_DASHBOARD_SECTION] =
  (role) => role.getIn([ 'ui', 'content'])
permissionMapping[PERMISSIONS.VIEW_BRAND_DASHBOARD_SECTION] =
  (role) => role.getIn([ 'ui', 'analytics_dashboard'])
permissionMapping[PERMISSIONS.VIEW_SECURITY_SECTION] =
  (role) => role.getIn([ 'ui', 'security'])
permissionMapping[PERMISSIONS.VIEW_SERVICES_SECTION] =
  (role) => role.getIn([ 'ui', 'services'])
permissionMapping[PERMISSIONS.VIEW_SUPPORT_SECTION] =
  (role) => role.getIn([ 'ui', 'support'])

// Analytics Reports
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR] =
  (role) => role.getIn([ 'ui', 'analytics_file_error'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION] =
  (role) => role.getIn([ 'ui', 'analytics_sp_contribution'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET] =
  (role) => role.getIn([ 'ui', 'analytics_sp_on_off_net'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW] =
  (role) => role.getIn([ 'ui', 'analytics_traffic_overview'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS] =
  (role) => role.getIn([ 'ui', 'analytics_unique_visitors'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_URL] =
  (role) => role.getIn([ 'ui', 'analytics_url'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_CACHE_HIT_RATE] =
  (role) => role.getIn([ 'ui', 'analytics_daily_cache_hit_rate'])
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_PLAYBACK_DEMO] =
  (role) => role.getIn([ 'ui', 'playback_demo'])

// Misc Functionality
permissionMapping[PERMISSIONS.VIEW_PROPERTY_CONFIG] =
  (role) => role.getIn([ 'ui', 'config'])
permissionMapping[PERMISSIONS.DENY_ALWAYS] =
  () => false
permissionMapping[PERMISSIONS.ALLOW_ALWAYS] =
  () => true
permissionMapping[PERMISSIONS.VIEW_PROPERTY_PURGE_STATUS] =
  (role) => role.getIn([ 'north', 'purge_many', 'list', 'allowed'])

// Content Item listing
permissionMapping[PERMISSIONS.VIEW_CONTENT_ACCOUNTS] =
  (role, roleId) => {
    // TODO: This role check was implemented to fix UDNP-1556.
    // This is a temporary fix and is definitely considered a hack. We should never
    // do role checking in our permission mapping functions. This should be removed
    // once we come up with a better way to support listing accounts for the
    // contribution report post 1.0.1. The work to fix this is tracked by UDNP-1557.
    const isSuperAdmin = (roleId === UDN_ADMIN_ROLE_ID) || (roleId === SUPER_ADMIN_ROLE_ID) || (roleId === UDN_USER_ROLE_ID)
    const canListAccounts = role.getIn(['aaa', 'accounts', 'list', 'allowed'], false)

    return isSuperAdmin && canListAccounts
  }
permissionMapping[PERMISSIONS.VIEW_CONTENT_GROUPS] =
  (role) => role.getIn([ 'aaa', 'groups', 'list', 'allowed'])
permissionMapping[PERMISSIONS.VIEW_CONTENT_PROPERTIES] =
  (role) => role.getIn([ 'north', 'published_hosts', 'list', 'allowed'])

// Account Permissions
permissionMapping[PERMISSIONS.CREATE_ACCOUNT] =
  (role) => role.getIn([ 'aaa', 'accounts', 'create', 'allowed'])
permissionMapping[PERMISSIONS.MODIFY_ACCOUNT] =
  (role) => role.getIn([ 'aaa', 'accounts', 'modify', 'allowed'])
permissionMapping[PERMISSIONS.DELETE_ACCOUNT] =
  (role) => role.getIn([ 'aaa', 'accounts', 'delete', 'allowed'])

// Group Permissions
permissionMapping[PERMISSIONS.CREATE_GROUP] =
  (role) => role.getIn([ 'aaa', 'groups', 'create', 'allowed'])
permissionMapping[PERMISSIONS.MODIFY_GROUP] =
  (role) => role.getIn([ 'aaa', 'groups', 'modify', 'allowed'])
permissionMapping[PERMISSIONS.DELETE_GROUP] =
  (role) => role.getIn([ 'aaa', 'groups', 'delete', 'allowed'])
permissionMapping[PERMISSIONS.VIEW_GROUP] =
  (role) => role.getIn([ 'aaa', 'groups', 'show', 'allowed'])

// Storage Permissions
permissionMapping[PERMISSIONS.VIEW_ANALYTICS_STORAGE] =
  (role) => role.getIn([ 'ui', 'analytics_storage_overview'])
permissionMapping[PERMISSIONS.CREATE_STORAGE] =
  (role) => role.getIn([ 'cis', 'ingest_points', 'create', 'allowed'])
permissionMapping[PERMISSIONS.VIEW_STORAGE] =
  (role) => role.getIn([ 'cis', 'ingest_points', 'show', 'allowed'])
permissionMapping[PERMISSIONS.LIST_STORAGE] =
  (role) => role.getIn([ 'cis', 'ingest_points', 'list', 'allowed'])
permissionMapping[PERMISSIONS.MODIFY_STORAGE] =
  (role) => role.getIn([ 'cis', 'ingest_points', 'modify', 'allowed'])
permissionMapping[PERMISSIONS.DELETE_STORAGE] =
  (role) => role.getIn([ 'cis', 'ingest_points', 'delete', 'allowed'])
permissionMapping[PERMISSIONS.CREATE_ACCESS_KEY] =
  (role) => role.getIn([ 'cis', 'access_keys', 'create', 'allowed'])

// Advanced
permissionMapping[PERMISSIONS.VIEW_ADVANCED] =
  (role) => role.getIn([ 'north', 'custom_policy_configs', 'list', 'allowed'])
permissionMapping[PERMISSIONS.MODIFY_ADVANCED] =
  (role) => role.getIn([ 'north', 'custom_policy_configs', 'modify', 'allowed'])

// Users Permissions
permissionMapping[PERMISSIONS.CREATE_USER] =
  (role) => role.getIn([ 'aaa', 'users', 'create', 'allowed'])
// UDN User having modify role as itself_only so it should be only able to edit itself
// This check will return true anyway with itself_only.
permissionMapping[PERMISSIONS.MODIFY_USER] =
  (role) => role.getIn([ 'aaa', 'users', 'modify', 'allowed']) === true
permissionMapping[PERMISSIONS.DELETE_USER] =
  (role) => role.getIn([ 'aaa', 'users', 'delete', 'allowed']) === true

// Users Roles
permissionMapping[PERMISSIONS.MODIFY_ROLE] =
  (role) => role.getIn([ 'aaa', 'roles', 'modify', 'allowed'])

// DNS permissions
// Need role.permissions.zones.list.allowed AND role.permissions.rr.list.allowed

permissionMapping[PERMISSIONS.VIEW_DNS] =
  (role) => role.getIn([ 'north', 'zones', 'list', 'allowed']) && role.getIn([ 'north', 'rr', 'list', 'allowed'])

permissionMapping[PERMISSIONS.CONFIGURE_DNS] =
  (role) => role.getIn([ 'north', 'zones', 'create', 'allowed']) && role.getIn([ 'north', 'rr', 'create', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_ZONE] =
  (role) => role.getIn([ 'north', 'zones', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_ZONE] =
  (role) => role.getIn([ 'north', 'zones', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_ZONE] =
  (role) => role.getIn([ 'north', 'zones', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_RECORD] =
  (role) => role.getIn([ 'north', 'rr', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_RECORD] =
  (role) => role.getIn([ 'north', 'rr', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_RECORD] =
  (role) => role.getIn([ 'north', 'rr', 'delete', 'allowed'])

//Security permissions
permissionMapping[PERMISSIONS.DELETE_CERTIFICATE] =
  (role) => role.getIn([ 'north', 'certs', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_CERTIFICATE] =
  (role) => role.getIn([ 'north', 'certs', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_CERTIFICATE] =
  (role) => role.getIn([ 'north', 'certs', 'modify', 'allowed'])

//Published Host permissions
permissionMapping[PERMISSIONS.DELETE_PROPERTY] =
  (role) => role.getIn([ 'north', 'published_hosts', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.CREATE_PROPERTY] =
  (role) => role.getIn([ 'north', 'published_hosts', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_PROPERTY] =
  (role) => role.getIn([ 'north', 'published_hosts', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.LIST_PROPERTY] =
  (role) => role.getIn([ 'north', 'published_hosts', 'list', 'allowed'])

// Network permissions
permissionMapping[PERMISSIONS.CREATE_NETWORK] =
  (role) => role.getIn([ 'north', 'networks', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_NETWORK] =
  (role) => role.getIn([ 'north', 'networks', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_NETWORK] =
  (role) => role.getIn([ 'north', 'networks', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.VIEW_NETWORK] =
  (role) => role.getIn([ 'north', 'networks', 'show', 'allowed'])

// POP permissions
permissionMapping[PERMISSIONS.CREATE_POP] =
  (role) => role.getIn([ 'north', 'pops', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_POP] =
  (role) => role.getIn([ 'north', 'pops', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_POP] =
  (role) => role.getIn([ 'north', 'pops', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.VIEW_POP] =
  (role) => role.getIn([ 'north', 'pops', 'show', 'allowed'])

// POD permissions
permissionMapping[PERMISSIONS.CREATE_POD] =
  (role) => role.getIn([ 'north', 'pods', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_POD] =
  (role) => role.getIn([ 'north', 'pods', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_POD] =
  (role) => role.getIn([ 'north', 'pods', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.VIEW_POD] =
  (role) => role.getIn([ 'north', 'pods', 'show', 'allowed'])

// Node permissions
permissionMapping[PERMISSIONS.CREATE_NODE] =
  (role) => role.getIn([ 'north', 'nodes', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_NODE] =
  (role) => role.getIn([ 'north', 'nodes', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_NODE] =
  (role) => role.getIn([ 'north', 'nodes', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.VIEW_NODE] =
  (role) => role.getIn([ 'north', 'nodes', 'show', 'allowed'])

// Location permissions
permissionMapping[PERMISSIONS.CREATE_LOCATION] =
  (role) => role.getIn([ 'north', 'locations', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_LOCATION] =
  (role) => role.getIn([ 'north', 'locations', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_LOCATION] =
  (role) => role.getIn([ 'north', 'locations', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.VIEW_LOCATION] =
  (role) => role.getIn([ 'north', 'locations', 'show', 'allowed'])

// Footprint permissions
permissionMapping[PERMISSIONS.CREATE_FOOTPRINT] =
  (role) => role.getIn([ 'north', 'footprints', 'create', 'allowed'])

permissionMapping[PERMISSIONS.MODIFY_FOOTPRINT] =
  (role) => role.getIn([ 'north', 'footprints', 'modify', 'allowed'])

permissionMapping[PERMISSIONS.DELETE_FOOTPRINT] =
  (role) => role.getIn([ 'north', 'footprints', 'delete', 'allowed'])

permissionMapping[PERMISSIONS.VIEW_FOOTPRINT] =
  (role) => role.getIn([ 'north', 'footprints', 'show', 'allowed'])


export const getLocationPermissions = (user) => ({
  viewAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_LOCATION),
  createAllowed: checkUserPermissions(user, PERMISSIONS.CREATE_LOCATION),
  deleteAllowed: checkUserPermissions(user, PERMISSIONS.DELETE_LOCATION),
  modifyAllowed: checkUserPermissions(user, PERMISSIONS.MODIFY_LOCATION)
})

export const getNetworkPermissions = (user) => ({
  viewAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_NETWORK),
  createAllowed: checkUserPermissions(user, PERMISSIONS.CREATE_NETWORK),
  deleteAllowed: checkUserPermissions(user, PERMISSIONS.DELETE_NETWORK),
  modifyAllowed: checkUserPermissions(user, PERMISSIONS.MODIFY_NETWORK)
})

export const getPOPPermissions = (user) => ({
  viewAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_POP),
  createAllowed: checkUserPermissions(user, PERMISSIONS.CREATE_POP),
  deleteAllowed: checkUserPermissions(user, PERMISSIONS.DELETE_POP),
  modifyAllowed: checkUserPermissions(user, PERMISSIONS.MODIFY_POP)
})

export const getPODPermissions = (user) => ({
  viewAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_POD),
  createAllowed: checkUserPermissions(user, PERMISSIONS.CREATE_POD),
  deleteAllowed: checkUserPermissions(user, PERMISSIONS.DELETE_POD),
  modifyAllowed: checkUserPermissions(user, PERMISSIONS.MODIFY_POD)
})

export const getFootprintsPermissions = (user) => ({
  viewAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_FOOTPRINT),
  createAllowed: checkUserPermissions(user, PERMISSIONS.CREATE_FOOTPRINT),
  deleteAllowed: checkUserPermissions(user, PERMISSIONS.DELETE_FOOTPRINT),
  modifyAllowed: checkUserPermissions(user, PERMISSIONS.MODIFY_FOOTPRINT)
})

export const getNODEPermissions = (user) => ({
  viewAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_NODE),
  createAllowed: checkUserPermissions(user, PERMISSIONS.CREATE_NODE),
  deleteAllowed: checkUserPermissions(user, PERMISSIONS.DELETE_NODE),
  modifyAllowed: checkUserPermissions(user, PERMISSIONS.MODIFY_NODE)
})

export const getStoragePermissions = (user) => ({
  viewAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_STORAGE),
  viewAnalyticAllowed: checkUserPermissions(user, PERMISSIONS.VIEW_ANALYTICS_STORAGE),
  listAllowed: checkUserPermissions(user, PERMISSIONS.LIST_STORAGE),
  createAllowed: checkUserPermissions(user, PERMISSIONS.CREATE_STORAGE),
  deleteAllowed: checkUserPermissions(user, PERMISSIONS.DELETE_STORAGE),
  modifyAllowed: checkUserPermissions(user, PERMISSIONS.MODIFY_STORAGE)
})

/**
 * checkUserPermissons check if user has permission
 * @param  {Map} user currentUser (merged with permissions - Map (usually from redux - currentUserPermissions))
 * @param  {String} permissionToCheck
 * @return {Boolean}
 */
export const checkUserPermissions = (user, permissionToCheck) => {
  const userPermissions = user && user.get('permissions')
  const userRoles = user && user.get('roles')

  if (!(userPermissions && userRoles)) {
    return false
  }

  return userRoles.some(roleId => {
    return permissionMapping[permissionToCheck](userPermissions, roleId)
  })

}
