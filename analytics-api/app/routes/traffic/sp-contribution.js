'use strict';

require('express-jsend');
let log       = require('../../logger');
let validator = require('../../validator');
let testData  = require('./sp-contribution-data');

function routeTrafficServiceProvider(req, res) {
  log.info('Getting traffic/sp-contribution');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
    service_type : {required: false, type: 'Service'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  // let options = {
  //   start        : params.start,
  //   end          : params.end,
  //   account      : params.account,
  //   group        : params.group,
  //   property     : params.property,
  //   service_type : params.service_type
  // };

  // let optionsFinal = db._getQueryOptions(options);

  res.jsend(testData);

}

module.exports = routeTrafficServiceProvider;
