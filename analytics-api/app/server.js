'use strict';

let compression  = require('compression');
let express      = require('express');
let morgan       = require('morgan');
var responseTime = require('response-time')
let auth         = require('./auth');
let router       = require('./router');
let log          = require('./logger');
let app          = express();

// NOTE: This file exports a function that must be executed when the module is
// required. This is done to allow mocking of the morgan module in the unit test.
// e.g. let server = require('./server')();
module.exports = function runServer() {

  // Measure response times
  app.use(responseTime());

  // gzip responses
  app.use(compression());

  // Start morgan access log
  // Morgan config options: https://github.com/expressjs/morgan
  // NOTE: The skip configurations below just tell morgan which level messages
  // should be logged as. It has no effect on which messages appear in the log
  // files — that is managed by Winston transports in ./logger.js

  // Log errors (status code >= 400)
  app.use(morgan('combined', {
    stream: log.errorStream,
    skip: (req, res) => { return res.statusCode < 400; }
  }));

  // Log everything else (status code < 400)
  app.use(morgan('combined', {
    stream: log.infoStream,
    skip: (req, res) => { return res.statusCode > 399; }
  }));

  // Ensure the request is coming from an authenticated user (via token in X-Auth-Token header)
  app.use(auth);

  // Attach the router
  app.use('/', router);

  return app;

};
