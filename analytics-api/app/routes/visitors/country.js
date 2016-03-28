'use strict';

require('express-jsend');
let _         = require('lodash');
let countries = require('country-data').countries;
let dataUtils = require('../../data-utils');
let db        = require('../../db');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData = require('./country-data');

function routeVisitorsCountry(req, res) {
  log.info('Getting visitors/country');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start                 : {required: true, type: 'Timestamp'},
    end                   : {required: false, type: 'Timestamp'},
    account               : {required: true, type: 'ID'},
    group                 : {required: false, type: 'ID'},
    property              : {required: false, type: 'Property'},
    granularity           : {required: false, type: 'Granularity'},
    aggregate_granularity : {required: false, type: 'Granularity'},
    max_countries         : {required: false, type: 'Number'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start                 : params.start,
    end                   : params.end,
    account               : params.account,
    group                 : params.group,
    property              : params.property,
    granularity           : params.granularity,
    aggregate_granularity : params.aggregate_granularity,
    dimension             : 'country'
  };

  db.getVisitorWithTotals(options).spread((visitorData, dimensionTotals, grandTotalData) => {
    let dimension              = 'country';
    let optionsFinal           = db._getQueryOptions(options);
    let maxCountries           = params.max_countries || 5;
    let dimensionTotalsGrouped = _.groupBy(dimensionTotals, dimension);
    let grandTotal             = grandTotalData[0].uniq_vis;
    let responseData = {
      total: grandTotal,
      countries: dataUtils.processVisitorDataByDimension(
        dimension, visitorData, dimensionTotalsGrouped, grandTotal, maxCountries, optionsFinal
      )
    };

    // Add the country code and proper country name
    responseData.countries.forEach((countryRecord) => {
      let code = countryRecord.name;
      countryRecord.code = code;
      countryRecord.name = countries[code] ? countries[code].name : code;
    });

    res.jsend(responseData);

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });
}

module.exports = routeVisitorsCountry;
