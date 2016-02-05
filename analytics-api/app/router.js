'use strict';

let router               = require('express').Router();
let routeTrafficTime     = require('./routes/traffic/time');
let routeTrafficCountry  = require('./routes/traffic/country');
let routeVisitorsTime    = require('./routes/visitors/time');
let routeVisitorsCountry = require('./routes/visitors/country');
let routeVisitorsOS      = require('./routes/visitors/os');
let routeVisitorsBrowser = require('./routes/visitors/browser');
let routeMetrics         = require('./routes/metrics');


// API routes
router.get('/traffic/time',     routeTrafficTime);
router.get('/traffic/country',  routeTrafficCountry);
router.get('/visitors/time',    routeVisitorsTime);
router.get('/visitors/country', routeVisitorsCountry);
router.get('/visitors/os',      routeVisitorsOS);
router.get('/visitors/browser', routeVisitorsBrowser);
router.get('/metrics',          routeMetrics);

// This middleware should always come after the configured routes.
// Valid requests will send responses before Express gets here. If any requests
// are made to unconfigured routes, Express will land here and send a 403.
router.use(errorHandler);


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
