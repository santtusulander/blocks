'use strict';

let mysql   = require('mysql');
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
