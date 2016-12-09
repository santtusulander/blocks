'use strict';

require('express-jsend');
let log               = require('../../logger');
let validator         = require('../../validator');
let computeGeoTraffic = require('../../utils/compute-geo-traffic');
let dataUtils         = require('../../data-utils');
// let testData          = require('./country-data');

function routeTrafficCountry(req, res) {
  log.info('Getting traffic/country');
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
    country_code : {required: false, type: 'Country_Code'},
    latitude_min : {required: false, type: 'Latitude'},
    latitude_max : {required: false, type: 'Latitude'},
    longitude_min: {required: false, type: 'Longitude'},
    longitude_max: {required: false, type: 'Longitude'},
    max_countries : {required: false, type: 'Number'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  // we don't support geo for country yet, so be sure we don't try to process
  params.include_geo = false;

  computeGeoTraffic({
    params         : params,
    geo_resolution : ['country'],
    areasName      : 'countries',
    maxAreas       : params.max_countries || 5,
    decorateRecord : (countryRecord, countryCode) => {
      countryRecord.code = dataUtils.get3CharCountryCodeFromCode(countryCode);
      countryRecord.name = dataUtils.getCountryNameFromCode(countryCode);
    },
    success        : (responseData) => {
      res.jsend(responseData);
    },
    failure        : (code, category, message) => {
      res.status(code).jerror(category, message);
    }
  });
}

module.exports = routeTrafficCountry;
