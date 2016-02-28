'use strict';

let _        = require('lodash');
let log      = require('../logger');
let db       = require('../db');
let validate = require('../validate');
let testData = require('./metrics-data');

function routeMetrics(req, res) {
  log.debug('query params:', req.query);
  
  let params = _.mapValues(req.query, value => parseInt(value));
  let errors = validate.params(params, {
    start   : {required: true, type: 'Timestamp'},
    end     : {required: false, type: 'Timestamp'},
    account : {required: true, type: 'ID'},
    group   : {required: false, type: 'ID'}
  });

  if (errors) {
    return res.status(400).send(errors);
  }

  db.getPropertyMetrics({
    start   : params.start,
    end     : params.end,
    account : params.account,
    group   : params.group
  }).spread((trafficData, cacheHitRatioData, transferRateData) => {
    if (trafficData && cacheHitRatioData && transferRateData) {
      let responseData = {
        data: []
      };

      // Build a list of unique property names
      let properties = _.uniq(cacheHitRatioData.map((row) => row.property));

      // Loop each property and build an object of data that includes traffic
      // data, average cache hit ratio, and transfer rates.
      properties.forEach((property) => {
        // Get the raw data for a single property
        let propertyTrafficData       = trafficData.filter((item) => item.property === property);
        let propertyCacheHitRatioData = cacheHitRatioData.filter((item) => item.property === property)[0];
        let propertyTransferRateData  = transferRateData.filter((item) => item.property === property)[0];

        // Build the data object for a single property
        let propertyData = {
          property: property,
          avg_cache_hit_rate: propertyCacheHitRatioData.chit_ratio,
          transfer_rates: {
            peak:    `${propertyTransferRateData.transfer_rate_peak.toFixed(1)} Gbps`,
            lowest:  `${propertyTransferRateData.transfer_rate_lowest.toFixed(1)} Gbps`,
            average: `${propertyTransferRateData.transfer_rate_average.toFixed(1)} Gbps`
          },
          traffic: propertyTrafficData.map((item) => {
            return {
              bytes: item.bytes,
              timestamp: item.epoch_start
            }
          })
        };

        // Push the object to the response data
        responseData.data.push(propertyData);
      });

    }

    res.json(testData({
      entityCount: 10,
      start: params.start,
      end: params.end
    }));

  }).catch((err) => {
    res.status(500).send('There was a database error. Check the logs for more information.');
  });

}

module.exports = routeMetrics;
