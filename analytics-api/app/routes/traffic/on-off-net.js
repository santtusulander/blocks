'use strict';

require('express-jsend');
let db        = require('../../db');
let log       = require('../../logger');
let validator = require('../../validator');
let testData  = require('./on-off-net-data');

function routeTrafficOnOffNet(req, res) {
  log.info('Getting traffic/on-off-net');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
    granularity  : {required: false, type: 'Granularity'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start        : params.start,
    end          : params.end,
    account      : params.account,
    group        : params.group,
    property     : params.property,
    granularity  : params.granularity
  };

  let optionsFinal = db._getQueryOptions(options);

  res.jsend(testData(optionsFinal));

}

module.exports = routeTrafficOnOffNet;
