import accountSelector from './account-selector'
import multireducer from 'multireducer'

export const account = require('./account').default;
export const exports = require('./exports').default;
export const form = require('redux-form').reducer;
export const group = require('./group').default;
export const host = require('./host').default;
export const topo = require('./topo').default;
export const content = require('./content').default;
export const traffic = require('./traffic').default;
export const ui = require('./ui').default;
export const visitors = require('./visitors').default;
export const purge = require('./purge').default;
export const user = require('./user').default;
export const metrics = require('./metrics').default;
export const reports = require('./reports').default;
export const roles = require('./roles').default;
export const permissions = require('./permissions').default;
export const support = require('./support').default;

//Account Management
export const dnsRecords = require('./dns-records/actions').default;
export const dns = require('./dns').default;

//Analytics
export const filters = require('./filters').default;

//Security
export const security = require('./security').default;

// Account Selectors
export const accountSelectors = multireducer({
  header: accountSelector,
  support: accountSelector,
  accountManagement: accountSelector,
  configuration: accountSelector,
  propertySummary: accountSelector,
  content: accountSelector,
  security: accountSelector,
  analytics: accountSelector
})
