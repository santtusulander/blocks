'use strict';

require('express-jsend');
let _        = require('lodash');
let log      = require('../logger');
let db       = require('../db');
let validate = require('../validate');
let testData = require('./metrics-data');

function routeMetrics(req, res) {
  log.info('Getting metrics');
  log.debug('query params:', req.query);
  
  let params = req.query;
  let errors = validate.params(params, {
    start   : {required: true, type: 'Timestamp'},
    end     : {required: false, type: 'Timestamp'},
    account : {required: true, type: 'ID'},
    group   : {required: false, type: 'ID'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  db.getMetrics({
    start   : params.start,
    end     : params.end,
    account : params.account,
    group   : params.group
  }).spread((trafficData, cacheHitRatioData, transferRateData) => {
    if (trafficData && cacheHitRatioData && transferRateData) {
      let responseData = [];

      // Set the selected level
      let selectedLevel = (params.group == null) ? 'group' : 'property';

      // Build a list of unique level identifiers
      let levels = _.uniq(cacheHitRatioData.map((row) => row[selectedLevel]));

      // Loop each level and build an object of data that includes traffic
      // data, average cache hit ratio, and transfer rates.
      levels.forEach((level) => {
        // Get the raw data for a single level
        let levelTrafficData       = trafficData.filter((item) => item[selectedLevel] === level);
        let levelCacheHitRatioData = cacheHitRatioData.filter((item) => item[selectedLevel] === level)[0];
        let levelTransferRateData  = transferRateData.filter((item) => item[selectedLevel] === level)[0];

        // Build the data object for a single level
        let levelData = {
          avg_cache_hit_rate: levelCacheHitRatioData.chit_ratio,
          transfer_rates: {
            peak:    `${levelTransferRateData.transfer_rate_peak.toFixed(1)} Gbps`,
            lowest:  `${levelTransferRateData.transfer_rate_lowest.toFixed(1)} Gbps`,
            average: `${levelTransferRateData.transfer_rate_average.toFixed(1)} Gbps`
          },
          traffic: levelTrafficData.map((item) => {
            return {
              bytes: item.bytes,
              timestamp: item.epoch_start
            }
          })
        };

        // Dynamically set a "selectedLevel" property on the level data
        // e.g. levelData = {group: 3}, levelData = {property: 'idean.com'}
        levelData[selectedLevel] = level;

        // Push the object to the response data
        responseData.push(levelData);

      });

      // res.jsend(responseData);

    }

    res.jsend(testData({
      entityCount: 10,
      start: params.start,
      end: params.end
    }));

  }).catch(() => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeMetrics;
