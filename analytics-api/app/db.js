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
