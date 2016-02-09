'use strict';

let express = require("express");
let morgan  = require('morgan');
let router  = require('./router');
let log     = require('./logger');
let app     = express();

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

// Attach the router
app.use('/', router);

module.exports = app;
