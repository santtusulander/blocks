'use strict';

require('express-jsend');
// let _         = require('lodash');
let log       = require('../logger');
// let db        = require('../db');
let validator = require('../validator');
let testData  = require('./sp-dashboard-data');

function routeSpDashboard(req, res) {
  log.info('Getting sp-dashboard');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start        : params.start,
    end          : params.end,
    account      : params.account,
    group        : params.group
  };

  res.jsend(testData(options));

}

module.exports = routeSpDashboard;
