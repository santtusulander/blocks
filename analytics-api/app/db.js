'use strict';

let mysql   = require('promise-mysql');
let Promise = require('bluebird');
let configs = require('./configs');
let log     = require('./logger');
let db      = {
  pool: mysql.createPool({
    connectionLimit : configs.dbConnectionLimit,
    host            : configs.dbHost,
    user            : configs.dbUser,
    password        : configs.dbPassword,
    database        : configs.dbName
  })
};


module.exports = db;

/**
 * Inject data into a parameterized query and execute it.
 *
 * @param  {string}  query A parameterized query
 * @param  {array}   data  The data to inject into the query
 * @return {Promise}       Returns a promise that is fulfilled with the query results
 */
function executeQuery(query, data) {
  // NOTE: We do this instead of passing an array of data to db.pool.query so we
  // can log the actual query before executing it.
  // NOTE: mysql.format automatically escapes the data to avoid SQL injection attacks.
  let queryFinal = mysql.format(query, data);

  log.debug('query:', queryFinal);

  // Grab a connection from the pool and run the query
  return db.pool.query(queryFinal);
}

/**
 * Get an object of options that gets piped into a parameterized query.
 *
 * @param  {object} options The custom options to merge with the defaults
 * @return {object}         An object literal with default options
 */
function getQueryOptions(options) {
  let optionDefaults = {
    start   : null,
    end     : Math.round(Date.now() / 1000),
    account : null,
    group   : null
  }

  return Object.assign({}, optionDefaults, options || {});
}

/**
 * Get hourly traffic data (bytes out) for all properties in a group within a
 * given time range. NOTE: The data returned is grouped by hour.
 *
 * @param  {object}  options Options that get piped into an SQL query
 * @return {Promise}         A promise that is fulfilled with the query results
 */
function getPropertyTraffic(options) {
  let optionsFinal = getQueryOptions(options);

  let queryParameterized = `
    SELECT epoch_start, sum(bytes) AS bytes, property
    FROM property_global_hour
    WHERE epoch_start BETWEEN ? and ?
      AND account_id = ?
      AND group_id = ?
      AND flow_dir = 'out'
    GROUP BY epoch_start;
  `;

  return executeQuery(queryParameterized, [
    optionsFinal.start,
    optionsFinal.end,
    optionsFinal.account,
    optionsFinal.group
  ]);
}
