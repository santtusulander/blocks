'use strict';

let router                      = require('express').Router();
let auth                        = require('./auth');
let configs                     = require('./configs');
let log                         = require('./logger');
let routeTraffic                = require('./routes/traffic');
let routeTrafficTime            = require('./routes/traffic/time');
let routeTrafficCountry         = require('./routes/traffic/country');
let routeTrafficTotal           = require('./routes/traffic/total');
let routeTrafficCPContribution  = require('./routes/traffic/cp-contribution');
let routeTrafficSPContribution  = require('./routes/traffic/sp-contribution');
let routeTrafficOnOffNet        = require('./routes/traffic/on-off-net');
let routeTrafficUrls            = require('./routes/traffic/urls');
let routeVisitorsTime           = require('./routes/visitors/time');
let routeVisitorsCountry        = require('./routes/visitors/country');
let routeVisitorsOS             = require('./routes/visitors/os');
let routeVisitorsBrowser        = require('./routes/visitors/browser');
let routeMetrics                = require('./routes/metrics');
let routeFileErrors             = require('./routes/file-errors');
let routeCPsWithTrafficForSP    = require('./routes/cps-with-traffic-for-sp');
let routeSPsWithTrafficForCP    = require('./routes/sps-with-traffic-for-cp');
let routeVersion                = require('./routes/version');

router.errorHandler = errorHandler;

// Routes that don't require auth come first
router.get(`/${configs.apiBaseFolder}/version`, routeVersion);

// Ensure the request is coming from an authenticated user (via token in X-Auth-Token header)
router.use(auth);

// API routes
router.get(`/${configs.apiBaseFolder}/traffic`,                  routeTraffic);
router.get(`/${configs.apiBaseFolder}/traffic/time`,             routeTrafficTime);
router.get(`/${configs.apiBaseFolder}/traffic/country`,          routeTrafficCountry);
router.get(`/${configs.apiBaseFolder}/traffic/total`,            routeTrafficTotal);
router.get(`/${configs.apiBaseFolder}/traffic/cp-contribution`,  routeTrafficCPContribution);
router.get(`/${configs.apiBaseFolder}/traffic/sp-contribution`,  routeTrafficSPContribution);
router.get(`/${configs.apiBaseFolder}/traffic/on-off-net`,       routeTrafficOnOffNet);
router.get(`/${configs.apiBaseFolder}/traffic/urls`,             routeTrafficUrls);
router.get(`/${configs.apiBaseFolder}/visitors/time`,            routeVisitorsTime);
router.get(`/${configs.apiBaseFolder}/visitors/country`,         routeVisitorsCountry);
router.get(`/${configs.apiBaseFolder}/visitors/os`,              routeVisitorsOS);
router.get(`/${configs.apiBaseFolder}/visitors/browser`,         routeVisitorsBrowser);
router.get(`/${configs.apiBaseFolder}/metrics`,                  routeMetrics);
router.get(`/${configs.apiBaseFolder}/file-errors`,              routeFileErrors);
router.get(`/${configs.apiBaseFolder}/cps-with-traffic-for-sp`,  routeCPsWithTrafficForSP);
router.get(`/${configs.apiBaseFolder}/sps-with-traffic-for-cp`,  routeSPsWithTrafficForCP);

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
