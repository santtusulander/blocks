'use strict';

require('express-jsend');
let log       = require('../../logger');
let db        = require('../../db');
let validator = require('../../validator');
let testData  = require('./time-data');

function routeTrafficTime(req, res) {
  log.info('Getting traffic/time');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
    service_type : {required: false, type: 'Service'},
    granularity  : {required: false, type: 'Granularity'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  db.getEgress({
    start        : params.start,
    end          : params.end,
    account      : params.account,
    group        : params.group,
    property     : params.property,
    service_type : params.service_type,
    granularity  : params.granularity,
    dimension    : 'global'
  }).then((trafficData) => {

    res.jsend(trafficData || []);

  }).catch(() => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });
}

module.exports = routeTrafficTime;
