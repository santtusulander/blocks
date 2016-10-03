'use strict';
/**
 * NOTE: File paths in this file will be relative to whatever context uses them.
 * They're just configuration strings.
 */

// Set the environment to development if it wasn't already specified
let env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Common configs for all environments
let commonConfigs = {
  apiBaseFolder: 'analytics',
  postmanCollection: './e2e/UDNP-Analytics-API.json.postman_collection',
  postmanEnvironment: `./e2e/UDNP-Analytics-API_${env}.postman_environment`
}

// Environment specific configs
let environmentConfigs = {
  development: {
    port: 3030,
    dbConnectionLimit: 100,
    dbHost: 'metrics-db.sea.cdx-dev.unifieddeliverynetwork.net',
    dbUser: 'ro',
    dbPassword: 'Read0nLy',
    dbName: 'metrics',
    aaaBaseURL: 'https://saltmaster.cdx-dev.unifieddeliverynetwork.net/v3'
  },
  staging: {
    port: 3040
  },
  production: {
    port: 3050
  }
};

// Export a new object that consists of the commonConfigs merged with the
// environment config that has a name matching the current value of the
// NODE_ENV environemnt variable.
module.exports = Object.assign({}, commonConfigs, environmentConfigs[env]);
