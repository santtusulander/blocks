'use strict';

require('express-jsend');
let countries = require('country-data').countries;
let _         = require('lodash');
let log       = require('../../logger');
let db        = require('../../db');
let validator = require('../../validator');
let testData  = require('./country-data');

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
    granularity  : {required: false, type: 'Granularity'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  db.getEgressWithHistorical({
    start        : params.start,
    end          : params.end,
    account      : params.account,
    group        : params.group,
    property     : params.property,
    service_type : params.service_type,
    granularity  : params.granularity,
    dimension    : 'country'
  }).spread((trafficData, historicalTrafficData) => {
    if (trafficData && historicalTrafficData) {
      let responseData = {
        total: 0,
        countries: []
      };

      let allCountryTrafficData        = _.groupBy(trafficData, 'country');
      let historicalTrafficDataGrouped = _.groupBy(historicalTrafficData, 'country');

      _.forOwn(allCountryTrafficData, (countryData, code) => {
        let countryRecord = {
          code: code,
          name: countries[code] ? countries[code].name : code,
          percent_change: 0.10,
          percent_total: 0.20,
          total: 0
        };

        countryRecord.detail = countryData.map((data) => {
          countryRecord.total += data.bytes;
          delete data.country;
          return data;
        });

        responseData.total += countryRecord.total;

        responseData.countries.push(countryRecord);

      });

      // Calculate percent total

      res.jsend(responseData);
    }

    // res.jsend(testData);

  }).catch(() => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTrafficCountry;
