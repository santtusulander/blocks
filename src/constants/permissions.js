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
export const VIEW_ANALYTICS_SECTION = 'VIEW_ANALYTICS_SECTION'
export const VIEW_CONTENT_SECTION = 'VIEW_CONTENT_SECTION'
export const VIEW_SECURITY_SECTION = 'VIEW_SECURITY_SECTION'
export const VIEW_SERVICES_SECTION = 'VIEW_SERVICES_SECTION'
export const VIEW_SUPPORT_SECTION = 'VIEW_SUPPORT_SECTION'

// Analytics Reports
export const VIEW_ANALYTICS_FILE_ERROR = 'VIEW_ANALYTICS_FILE_ERROR'
export const VIEW_ANALYTICS_SP_CONTRIBUTION = 'VIEW_ANALYTICS_SP_CONTRIBUTION'
export const VIEW_ANALYTICS_SP_ON_OFF_NET = 'VIEW_ANALYTICS_SP_ON_OFF_NET'
export const VIEW_ANALYTICS_TRAFFIC_OVERVIEW = 'VIEW_ANALYTICS_TRAFFIC_OVERVIEW'
export const VIEW_ANALYTICS_UNIQUE_VISITORS = 'VIEW_ANALYTICS_UNIQUE_VISITORS'
export const VIEW_ANALYTICS_URL = 'VIEW_ANALYTICS_URL'
export const VIEW_ANALYTICS_PLAYBACK_DEMO = 'VIEW_ANALYTICS_PLAYBACK_DEMO'

// Misc Functionality
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

//DNS Permissions
export const CREATE_RECORD = 'CREATE_RECORD'
export const VIEW_DNS = 'VIEW_DNS'
export const CREATE_ZONE = 'CREATE_ZONE'
export const MODIFY_ZONE = 'MODIFY_ZONE'
