'use strict';

let router = require('express').Router();

// This middleware should always come first. It will log all incoming requests.
router.use(requestLogger);

// TODO: Configure API end points

// This middleware should always come after the configured routes.
// Valid requests will send responses before Express gets here. If any requests
// are made to unconfigured routes, Express will land here and send a 403.
router.use(errorHandler);


/**
 * Log all requests made to the API.
 */
function requestLogger(req, res, next) {
  console.log(`${req.method} request received: ${req.originalUrl}`);
  next();
}

/**
 * Deny requests made to unconfigured routes.
 */
function errorHandler(req, res) {
  let message = `You must provide a proper end point to the API. Requested path: ${req.originalUrl}`;
  console.log(`ERROR 403: ${message}`);
  res.status(403).send(message);
}

module.exports = router;


// TODO: Implement more intelligent logging (log to file, show timestamps,
// log level configs, etc)? Possibly use winston or morgan (or both).
