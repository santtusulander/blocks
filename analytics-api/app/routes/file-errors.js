'use strict';

require('express-jsend');
let _         = require('lodash');
let log       = require('../logger');
let dataUtils = require('../data-utils');
let db        = require('../db');
let validator = require('../validator');
let testData  = require('./file-errors-data');

function routeFileErrors(req, res) {
  log.info('Getting file-error');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start   : {required: true, type: 'Timestamp'},
    end     : {required: false, type: 'Timestamp'},
    account : {required: false, type: 'ID'},
    group   : {required: false, type: 'ID'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start   : params.start,
    end     : params.end,
    account : params.account,
    group   : params.group
  };

  res.jsend(testData);
  // db.getFileErrors(options).spread((trafficData, historicalTrafficData, aggregateData) => {
  //
  //
  //
  // }).catch((err) => {
  //   log.error(err);
  //   res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  // });

}

module.exports = routeFileErrors;
