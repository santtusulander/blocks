'use strict';

let packageJSON = require('../../package.json');
let log         = require('../logger');

/**
 * Responds with the version from analytics-api/package.json as text.
 */
function routeVersion(req, res) {
  log.debug(`API version is ${packageJSON.version}`);
  res.send(packageJSON.version);
}

module.exports = routeVersion;
