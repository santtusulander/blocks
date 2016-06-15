'use strict';

let packageJSON = require('../../package.json');
let configs     = require('../configs');
let db          = require('../db');
let log         = require('../logger');

routeVersion.get = () => packageJSON.version;

/**
 * Responds with metadata related to the analytics API and metrics database.
 */
function routeVersion(req, res) {
  log.info('Getting version');
  log.debug(`API version is ${packageJSON.version}`);

  db.getSchemaInfo().then((schemaInfo) => {

    schemaInfo = schemaInfo[0];
    res.jsend({
      api_port: configs.port,
      api_version: packageJSON.version,
      db_schema_version: schemaInfo.version,
      db_name: configs.dbName,
      db_host: configs.dbHost
    });

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeVersion;
