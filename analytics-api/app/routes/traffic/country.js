'use strict';

require('express-jsend');
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

  db.getDataForCountry(options).spread((trafficData, historicalTrafficData, spTrafficData, spHistoricalTrafficData) => {
    let responseData = {
      total: 0,
      countries: []
    };

    if (trafficData && historicalTrafficData) {
      trafficData = trafficData.concat(spTrafficData);
      historicalTrafficData = historicalTrafficData.concat(spHistoricalTrafficData);

      let optionsFinal                    = db._getQueryOptions(options);
      let maxCountries                    = params.max_countries || 5;
      let allCountryTrafficData           = _.groupBy(trafficData, 'country');
      let allHistoricalCountryTrafficData = _.groupBy(historicalTrafficData, 'country');

      _.forOwn(allCountryTrafficData, (countryData, code) => {
        let trafficRecords;
        let total = 0;
        let requests = 0;
        let historicalTotal = 0;
        let countryRecord = {
          code: dataUtils.get3CharCountryCodeFromCode(code),
          name: dataUtils.getCountryNameFromCode(code),
          percent_change: 0.10,
          percent_total: 0.20,
          historical_total: 0,
          total: 0,
          requests: 0,
          detail: []
        };

        // Set the detail array on the countryRecord
        // Calculate total egress for the country
        // Remove the country key from each traffic record — since we're already
        // grouped by country, we don't need to transfer all that extra data
        // over the network.
        trafficRecords = countryData.map((data) => {
          total += data.bytes;
          requests += data.requests;
          return _.pick(data, ['bytes', 'timestamp', 'requests']);
        });

        // Ensure there is a record for each time interval
        trafficRecords = dataUtils.buildContiguousTimeline(
          trafficRecords,
          optionsFinal.start,
          optionsFinal.end,
          optionsFinal.granularity,
          ['bytes', 'requests']
        );

        // Add bits per second to each traffic record
        trafficRecords = trafficRecords.map((record) => {
          record.bits_per_second = dataUtils.getBPSFromBytes(record.bytes, optionsFinal.granularity);
          return record;
        });

        // Save the country total to the countryRecord
        countryRecord.total = total;

        // Save the total country requests to the countryRecord
        countryRecord.requests = requests;

        // Save total bits per second to the countryRecord
        countryRecord.bits_per_second = Math.round((total * dataUtils.bitsPerByte) / (optionsFinal.end - optionsFinal.start));

        // Save average bits per second to the countryRecord
        let populatedTrafficBytes = trafficRecords
          .filter((record) => record.bytes !== null)
          .map((record) => record.bytes);
        let averageBytes = _.mean(populatedTrafficBytes);
        countryRecord.average_bits_per_second = dataUtils.getBPSFromBytes(averageBytes, optionsFinal.granularity);
        countryRecord.average_bytes = Math.round(averageBytes);

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

        countryRecord.detail = trafficRecords;

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

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTrafficCountry;
