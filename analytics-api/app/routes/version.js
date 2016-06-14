'use strict';

let packageJSON = require('../../package.json');
let configs     = require('../configs');
let log         = require('../logger');

routeVersion.get = () => packageJSON.version;

/**
 * Responds with the version from analytics-api/package.json as text.
 */
function routeVersion(req, res) {
  log.debug(`API version is ${packageJSON.version}`);
  res.send({
    version: packageJSON.version,
    db: configs.dbName,
    host: configs.dbHost,
    port: configs.port
  });
}

module.exports = routeVersion;
