'use strict';

let app = require('./app/server');
let log = require('./app/logger');

app.listen(3030, function () {
  log.info('UDN Portal Analytics API server listening on http://localhost:3030');
});
