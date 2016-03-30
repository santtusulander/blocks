'use strict';

let app     = require('./app/server')();
let log     = require('./app/logger');
let version = require('./app/routes/version').get();
let configs = require('./app/configs');

app.listen(configs.port, function () {
  log.info(`UDN Portal Analytics API v${version}`);
  log.info(`Listening on port ${configs.port}`);
  log.info(`Running in ${process.env.NODE_ENV} mode`);
});
