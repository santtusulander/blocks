'use strict';

let express = require("express");
let morgan  = require('morgan');
let router  = require('./router');
let log     = require('./logger');
let app     = express();

// Start access log
// Morgan config options: https://github.com/expressjs/morgan
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
