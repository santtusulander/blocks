export const account = require('./account').default;
export const form = require('redux-form').reducer;
export const group = require('./group').default;
export const host = require('./host').default;
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
export const dashboard = require('./dashboard').default;
export const mapbox = require('./mapbox').default;

//Account Management
export const dnsRecords = require('./dns-records/actions').default;
export const dns = require('./dns').default;

//Analytics
export const filters = require('./filters').default;

//Cache
export const cache = require('./cache').default;

//Security
export const security = require('./security').default;

//Entities
export const entities = require('./entities').default

//serviceInfo
export const serviceInfo = require('./service-info/index.js').default;

//pagination
export const pagination = require('./pagination').default;

//HTTP file upload
export const storageUploads = require('./http-file-upload').default;
