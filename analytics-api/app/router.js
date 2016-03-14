'use strict';

let router               = require('express').Router();
let log                  = require('./logger');
let routeTrafficTime     = require('./routes/traffic/time');
let routeTrafficCountry  = require('./routes/traffic/country');
let routeTrafficTotal    = require('./routes/traffic/total');
let routeVisitorsTime    = require('./routes/visitors/time');
let routeVisitorsCountry = require('./routes/visitors/country');
let routeVisitorsOS      = require('./routes/visitors/os');
let routeVisitorsBrowser = require('./routes/visitors/browser');
let routeMetrics         = require('./routes/metrics');
let routeVersion         = require('./routes/version');

router.errorHandler = errorHandler;

// API routes
router.get('/traffic/time',     routeTrafficTime);
router.get('/traffic/country',  routeTrafficCountry);
router.get('/traffic/total',    routeTrafficTotal);
router.get('/visitors/time',    routeVisitorsTime);
router.get('/visitors/country', routeVisitorsCountry);
router.get('/visitors/os',      routeVisitorsOS);
router.get('/visitors/browser', routeVisitorsBrowser);
router.get('/metrics',          routeMetrics);
router.get('/version',          routeVersion);

// This middleware should always come after the configured routes.
// Valid requests will send responses before Express gets here. If any requests
// are made to unconfigured routes, Express will land here and send a 403.
router.use(router.errorHandler);


/**
 * Deny requests made to unconfigured routes.
 */
function errorHandler(req, res) {
  let message = `You must request a correct API end point. Could not find requested path: ${req.originalUrl}`;
  log.error(`404: ${message}`);
  res.status(404).send(message);
}

module.exports = router;
