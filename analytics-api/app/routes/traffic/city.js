'use strict';

require('express-jsend');
let log             = require('../../logger');
let validator       = require('../../validator');
let routeTrafficGeo = require('./geo');

function routeTrafficCity(req, res) {
  log.info('Getting traffic/city');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
    service_type : {required: false, type: 'Service'},
    granularity  : {required: false, type: 'Granularity'},
    max_cities   : {required: false, type: 'Number'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let maxCities = params.max_cities || 5;

  routeTrafficGeo(params, res, ['country', 'city'], 'cities', maxCities);
}

module.exports = routeTrafficCity;
