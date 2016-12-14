'use strict';

require('express-jsend');
let log               = require('../../logger');
let validator         = require('../../validator');
let computeGeoTraffic = require('../../utils/compute-geo-traffic');

function routeTrafficCity(req, res) {
  log.info('Getting traffic/city');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start          : {required: true,  type: 'Timestamp'},
    end            : {required: false, type: 'Timestamp'},
    account        : {required: true,  type: 'ID'},
    group          : {required: false, type: 'ID'},
    property       : {required: false, type: 'Property'},
    service_type   : {required: false, type: 'Service'},
    granularity    : {required: false, type: 'Granularity'},
    country_code   : {required: false, type: 'Country_Code'},
    latitude_south : {required: false, type: 'Latitude'},
    longitude_west : {required: false, type: 'Longitude'},
    latitude_north : {required: false, type: 'Latitude'},
    longitude_east : {required: false, type: 'Longitude'},
    include_geo    : {required: false, type: 'Boolean'},
    max_cities     : {required: false, type: 'Number'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  computeGeoTraffic({
    params         : params,
    geo_resolution : ['country', 'region', 'city'],
    areasName      : 'cities',
    maxAreas       : params.max_cities || 5,
    success        : (responseData) => {
      res.jsend(responseData);
    },
    failure        : (code, category, message) => {
      res.status(code).jerror(category, message);
    }
  });
}

module.exports = routeTrafficCity;
