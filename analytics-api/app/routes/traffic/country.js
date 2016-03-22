'use strict';

require('express-jsend');
let countries = require('country-data').countries;
let _         = require('lodash');
let dataUtils = require('../../data-utils');
let db        = require('../../db');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData  = require('./country-data');

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
    max_countries : {required: false, type: 'Number'}
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
    service_type : params.service_type,
    granularity  : params.granularity,
    dimension    : 'country'
  };

  db.getEgressWithHistorical(options).spread((trafficData, historicalTrafficData) => {
    let responseData = {
      total: 0,
      countries: []
    };

    if (trafficData && historicalTrafficData) {
      let optionsFinal = db._getQueryOptions(options);
      let maxCountries = params.max_countries || 5;
      let allCountryTrafficData           = _.groupBy(trafficData, 'country');
      let allHistoricalCountryTrafficData = _.groupBy(historicalTrafficData, 'country');

      _.forOwn(allCountryTrafficData, (countryData, code) => {
        let trafficRecords;
        let total = 0;
        let historicalTotal = 0;
        let countryRecord = {
          code: countries[code] ? countries[code].alpha3 : code,
          name: countries[code] ? countries[code].name : code,
          percent_change: 0.10,
          percent_total: 0.20,
          historical_total: 0,
          total: 0,
          detail: []
        };

        // Set the detail array on the countryRecord
        // Calculate total egress for the country
        // Remove the country key from each traffic record — since we're already
        // grouped by country, we don't need to transfer all that extra data
        // over the network.
        trafficRecords = countryData.map((data) => {
          total += data.bytes;
          return _.pick(data, ['bytes', 'timestamp']);
        });

        // Ensure there is a record for each time interval
        trafficRecords = dataUtils.buildContiguousTimeline(
          trafficRecords,
          optionsFinal.start,
          optionsFinal.end,
          optionsFinal.granularity
        );
        countryRecord.detail = trafficRecords;

        // Save the country total to the countryRecord
        countryRecord.total = total;

        // Add to the total traffic amount for all countries
        responseData.total += total;

        // Sum the historical traffic
        if (allHistoricalCountryTrafficData[code]) {
          historicalTotal = allHistoricalCountryTrafficData[code].reduce((runningTotal, currentRecord) => {
            return runningTotal + currentRecord.bytes;
          }, 0);
        }

        // Save the historical total to the countryRecord
        countryRecord.historical_total = historicalTotal;

        // Calculate percent change
        countryRecord.percent_change = parseFloat(((total - historicalTotal) / historicalTotal).toFixed(4));

        // Add the countryRecord to the response data
        responseData.countries.push(countryRecord);

      });

      // Calculate percent total for each country
      responseData.countries.forEach((countryRecord) => {
        countryRecord.percent_total = parseFloat((countryRecord.total / responseData.total).toFixed(4));
      });

      // Sort the countries by their total in descending order
      responseData.countries = _.sortBy(responseData.countries, 'total').reverse();

      // Only include the number of countries specified by maxCountries
      responseData.countries = _.take(responseData.countries, maxCountries);
    }

    res.jsend(responseData);

  }).catch(() => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTrafficCountry;
