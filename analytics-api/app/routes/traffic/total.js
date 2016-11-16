'use strict';

require('express-jsend');
let log       = require('../../logger');
let db        = require('../../db');
let validator = require('../../validator');
// let testData  = require('./total-data');

function routeTrafficTotal(req, res) {
  log.info('Getting traffic/total');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start    : {required: true, type: 'Timestamp'},
    end      : {required: false, type: 'Timestamp'},
    account  : {required: true, type: 'ID'},
    group    : {required: false, type: 'ID'},
    property : {required: false, type: 'Property'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  db.getTotal({
    start    : params.start,
    end      : params.end,
    account  : params.account,
    group    : params.group,
    property : params.property
  }).then((trafficData) => {

    res.jsend(trafficData[0] || {});

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTrafficTotal;
