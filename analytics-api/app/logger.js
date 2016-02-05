'use strict';

let path    = require('path');
let winston = require('winston');

// Default options used for winston file transports
let defaultFileTransportOptions = {
  json: false,
  handleExceptions: true,
  colorize: false,
  prettyPrint: true,
  showLevel: true,
  timestamp: true
};

// Set up winston logging transports
// This logger uses npm log levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
// Logging levels:    https://github.com/winstonjs/winston#logging-levels
// Transport options: https://github.com/winstonjs/winston/blob/master/docs/transports.md
let logger = new winston.Logger({
  transports: [
    // Includes error, warn, and info logs
    new winston.transports.File(Object.assign({
      name: 'info',
      filename: path.join(__dirname, '/logs/level-3-info.log'),
      level: 'info'
    }, defaultFileTransportOptions)),

    // Includes error and warn logs
    new winston.transports.File(Object.assign({
      name: 'warn',
      filename: path.join(__dirname, '/logs/level-2-warn.log'),
      level: 'warn'
    }, defaultFileTransportOptions)),

    // Send error, warn, info, and debug logs to the console
    new winston.transports.Console({
      level: 'debug',
      json: false,
      handleExceptions: true,
      colorize: true,
      showLevel: true,
      timestamp: true
    })
  ],
  exitOnError: false
});

// Log streams used by the morgan access logger
logger.infoStream = {
  write: (message) => logger.info(message)
};

logger.errorStream = {
  write: (message) => logger.error(message)
};

module.exports = logger;
