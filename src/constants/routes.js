module.exports = {
  analytics: '/analysis',
  analyticsBrand: '/analysis/:brand',
  analyticsAccount: '/analysis/:brand/:account',
  analyticsGroup: '/analysis/:brand/:account/:group',
  analyticsProperty: '/analysis/:brand/:account/:group/:property',

  analyticsTabTraffic: 'traffic',
  analyticsTabVisitors: 'visitors',
  analyticsTabCacheHitRate: 'cache-hit-rate',
  analyticsTabOnOffNet: 'on-off-net',
  analyticsTabContribution: 'contribution',
  analyticsTabFileError: 'file-error',
  analyticsTabUrlReport: 'url-report',
  analyticsTabPlaybackDemo: 'playback-demo',

  content: '/content',
  contentBrand: '/content/:brand',
  contentAccount: '/content/:brand/:account',
  contentGroups: '/content/:brand/:account/groups',
  contentGroup: '/content/:brand/:account/groups/:group',
  contentProperty: '/content/:brand/:account/groups/:group/:property',
  contentPropertySummary: '/content/:brand/:account/groups/:group/:property/summary',
  contentPropertyPurgeStatus: '/content/:brand/:account/groups/:group/:property/purge-status',
  contentPropertyConfiguration: '/content/:brand/:account/groups/:group/:property/configuration',

  accountManagement: '/account-management',
  accountManagementBrand: '/account-management/:brand',
  accountManagementAccount: '/account-management/:brand/:account',
  accountManagementGroup: '/account-management/:brand/:account/:group',
  accountManagementProperty: '/account-management/:brand/:account/:group/:property',

  accountManagementTabAccountDetails: 'details',
  accountManagementTabAccountGroups: 'groups',
  accountManagementTabAccountUsers: 'users',

  accountManagementTabSystemAccounts: 'accounts',
  accountManagementTabSystemUsers: 'users',
  accountManagementTabSystemBrands: 'brands',
  accountManagementTabSystemDNS: 'dns',
  accountManagementTabSystemRoles: 'roles',
  accountManagementTabSystemServices: 'services',

  services: '/services',
  servicesBrand: '/services/:brand',
  servicesAccount: '/services/:brand/:account',
  servicesGroup: '/services/:brand/:account/:group',
  servicesProperty: '/services/:brand/:account/:group/:property',

  security: '/security',
  securityBrand: '/security/:brand',
  securityAccount: '/security/:brand/:account',
  securityGroup: '/security/:brand/:account/:group',
  securityProperty: '/security/:brand/:account/:group/:property',

  securityTabSslCertificate: 'ssl-certificate',
  securityTabContentTargeting: 'content-targeting',
  securityTabTokenAuthentication: 'token-authentication',

  support: '/support',
  supportBrand: '/support/:brand',
  supportAccount: '/support/:brand/:account',
  supportGroup: '/support/:brand/:account/:group',
  supportProperty: '/support/:brand/:account/:group/:property',

  supportTabTickets: 'tickets',
  supportTabTools: 'tools',
  supportTabDocumentation: 'documentation',

  configuration: '/services',

  user: '/user',
  userBrand: '/user/:brand',
  userAccount: '/user/:brand/:account',

  dashboard: '/dashboard',
  dashboardBrand: '/dashboard/:brand',
  dashboardAccount: '/dashboard/:brand/:account',
  network: '/network',
  networkBrand: '/network/:brand',
  networkAccount: '/network/:brand/:account',
  networkGroups: '/network/:brand/:account/groups'
}
