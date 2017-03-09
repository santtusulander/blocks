/**
 * These constants are meant to be used in conjunction with the <IsAllowed>
 * component. For example:
 *
 * <IsAllowed to={VIEW_CONTENT_SECTION}>
 *   { some content that needs to be conditionally hidden based on a user's role }
 * </IsAllowed>
 *
 * The naming convention for these constants should be VERB_NOUN, so that using
 * the component reads like a sentence.
 */

// Sections
export const VIEW_ACCOUNT_SECTION = 'VIEW_ACCOUNT_SECTION'
export const VIEW_ACCOUNT_DETAIL = 'VIEW_ACCOUNT_DETAIL'
export const VIEW_ANALYTICS_SECTION = 'VIEW_ANALYTICS_SECTION'
export const VIEW_CONTENT_SECTION = 'VIEW_CONTENT_SECTION'
export const VIEW_NETWORK_SECTION = 'VIEW_NETWORK_SECTION'
export const VIEW_DASHBOARD_SECTION = 'VIEW_DASHBOARD_SECTION'
export const VIEW_SECURITY_SECTION = 'VIEW_SECURITY_SECTION'
export const VIEW_SERVICES_SECTION = 'VIEW_SERVICES_SECTION'
export const VIEW_SUPPORT_SECTION = 'VIEW_SUPPORT_SECTION'

// Analytics Reports
export const VIEW_ANALYTICS_FILE_ERROR = 'VIEW_ANALYTICS_FILE_ERROR'
export const VIEW_ANALYTICS_SP_CONTRIBUTION = 'VIEW_ANALYTICS_SP_CONTRIBUTION'
export const VIEW_ANALYTICS_SP_ON_OFF_NET = 'VIEW_ANALYTICS_SP_ON_OFF_NET'
export const VIEW_ANALYTICS_CACHE_HIT_RATE = 'VIEW_ANALYTICS_CACHE_HIT_RATE'
export const VIEW_ANALYTICS_TRAFFIC_OVERVIEW = 'VIEW_ANALYTICS_TRAFFIC_OVERVIEW'
export const VIEW_ANALYTICS_UNIQUE_VISITORS = 'VIEW_ANALYTICS_UNIQUE_VISITORS'
export const VIEW_ANALYTICS_STORAGE = 'VIEW_ANALYTICS_STORAGE'
export const VIEW_ANALYTICS_URL = 'VIEW_ANALYTICS_URL'
export const VIEW_ANALYTICS_PLAYBACK_DEMO = 'VIEW_ANALYTICS_PLAYBACK_DEMO'

// Misc Functionality
export const VIEW_PROPERTY_PURGE_STATUS = 'VIEW_PROPERTY_PURGE_STATUS'
export const VIEW_PROPERTY_CONFIG = 'VIEW_PROPERTY_CONFIG'

// Deny/Allow always (for testing)
export const DENY_ALWAYS = 'DENY_ALWAYS'
export const ALLOW_ALWAYS = 'ALLOW_ALWAYS'

// AAA Content Item listing
export const VIEW_CONTENT_ACCOUNTS = 'VIEW_CONTENT_ACCOUNTS'
export const VIEW_CONTENT_GROUPS = 'VIEW_CONTENT_GROUPS'
export const VIEW_CONTENT_PROPERTIES = 'VIEW_CONTENT_PROPERTIES'

// AAA Account Permissions
export const MODIFY_ACCOUNTS = 'MODIFY_ACCOUNTS'

// AAA Group Permissions
export const CREATE_GROUP = 'CREATE_GROUP'
export const MODIFY_GROUP = 'MODIFY_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const VIEW_GROUP = 'VIEW_GROUP'

// AAA Users Permissions
export const CREATE_USER = 'CREATE_USER'
export const MODIFY_USER = 'MODIFY_USER'


//DNS Permissions
export const CREATE_RECORD = 'CREATE_RECORD'
export const VIEW_DNS = 'VIEW_DNS'
export const CREATE_ZONE = 'CREATE_ZONE'
export const MODIFY_ZONE = 'MODIFY_ZONE'
export const DELETE_ZONE = 'DELETE_ZONE'

//Security Permissions
export const CREATE_CERTIFICATE = 'CREATE_CERTIFICATE'
export const MODIFY_CERTIFICATE = 'MODIFY_CERTIFICATE'
export const DELETE_CERTIFICATE = 'DELETE_CERTIFICATE'

//Published Host permissions
export const CREATE_PROPERTY = 'CREATE_CERTIFICATE'
export const MODIFY_PROPERTY = 'MODIFY_CERTIFICATE'
export const DELETE_PROPERTY = 'DELETE_CERTIFICATE'

// Network Permissions
export const CREATE_NETWORK = 'CREATE_NETWORK'
export const MODIFY_NETWORK = 'MODIFY_NETWORK'
export const DELETE_NETWORK = 'DELETE_NETWORK'
export const VIEW_NETWORK = 'VIEW_NETWORK'

// POP Permissions
export const CREATE_POP = 'CREATE_POP'
export const MODIFY_POP = 'MODIFY_POP'
export const DELETE_POP = 'DELETE_POP'
export const VIEW_POP = 'VIEW_POP'

// POD Permissions
export const CREATE_POD = 'CREATE_POD'
export const MODIFY_POD = 'MODIFY_POD'
export const DELETE_POD = 'DELETE_POD'
export const VIEW_POD = 'VIEW_POD'

// NODE Permissions
export const CREATE_NODE = 'CREATE_NODE'
export const MODIFY_NODE = 'MODIFY_NODE'
export const DELETE_NODE = 'DELETE_NODE'
export const VIEW_NODE = 'VIEW_NODE'

// Location Permissions
export const CREATE_LOCATION = 'CREATE_LOCATION'
export const MODIFY_LOCATION = 'MODIFY_LOCATION'
export const DELETE_LOCATION = 'DELETE_LOCATION'
export const VIEW_LOCATION = 'VIEW_LOCATION'

// Footprint Permissions
export const CREATE_FOOTPRINT = 'CREATE_FOOTPRINT'
export const MODIFY_FOOTPRINT = 'MODIFY_FOOTPRINT'
export const DELETE_FOOTPRINT = 'DELETE_FOOTPRINT'
export const VIEW_FOOTPRINT = 'VIEW_FOOTPRINT'

// Storage Permissions
export const CREATE_STORAGE = 'CREATE_STORAGE'
export const MODIFY_STORAGE = 'MODIFY_STORAGE'
export const DELETE_STORAGE = 'DELETE_STORAGE'
export const VIEW_STORAGE = 'VIEW_STORAGE'
export const LIST_STORAGE = 'LIST_STORAGE'
