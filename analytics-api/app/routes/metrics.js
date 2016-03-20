'use strict';

require('express-jsend');
let _         = require('lodash');
let log       = require('../logger');
let dataUtils = require('../data-utils');
let db        = require('../db');
let validator = require('../validator');

function routeMetrics(req, res) {
  log.info('Getting metrics');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
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
  }).spread((trafficData, historicalTrafficData, aggregateData) => {
    let responseData = [];

    if (trafficData && historicalTrafficData && aggregateData) {
      // Set the selected level
      let selectedLevel = (params.group == null) ? 'group' : 'property';

      // Build a list of unique level identifiers
      let levels = _.uniq(aggregateData.map((row) => row[selectedLevel]));

      // Loop each level and build an object of data that includes traffic
      // data, average cache hit ratio, and transfer rates.
      levels.forEach((level) => {
        // Get the raw data for a single level
        let levelTrafficData           = trafficData.filter((item) => item[selectedLevel] === level);
        let levelHistoricalTrafficData = historicalTrafficData.filter((item) => item[selectedLevel] === level);
        let levelAggregateData         = aggregateData.filter((item) => item[selectedLevel] === level)[0];
        let transferRates              = {
          peak    : dataUtils.getTransferRatesFromBytes(levelAggregateData.bytes_peak, 'hour'),
          average : dataUtils.getTransferRatesFromBytes(levelAggregateData.bytes_average, 'hour'),
          lowest  : dataUtils.getTransferRatesFromBytes(levelAggregateData.bytes_lowest, 'hour')
        };

        // Reformat traffic data
        let levelTrafficDataFormatted = levelTrafficData.map((item) => _.pick(item, ['bytes', 'timestamp']));
        let levelHistoricalTrafficDataFormatted = levelHistoricalTrafficData.map((item) => _.pick(item, ['bytes', 'timestamp']));

        // Calculate historical variance
        let historicalVarianceData = [];

        // The historical data is from the duration of time prior to the
        // requested time range.
        let duration               = parseInt(params.end) - parseInt(params.start) + 1;
        let trafficBytes           = [];
        let historicalTrafficBytes = [];
        let matchIndex             = 0;

        // Build arrays of bytes for requested traffic and historical traffic.
        // Ensure we are operating on historical traffic that has the same
        // number of records as the requested traffic.
        _.forEach(levelTrafficDataFormatted, function(record){
          // Match historical records based on timestamp
          let matchingHistoricalRecord = levelHistoricalTrafficDataFormatted[matchIndex];
          let isMatch = matchingHistoricalRecord && (parseInt(record.timestamp) - duration) === parseInt(matchingHistoricalRecord.timestamp);

          trafficBytes.push(record.bytes);

          // If a matching historical record exists, add it to the list
          // Keep track of where we left off with matchIndex
          if (matchingHistoricalRecord && isMatch) {
            historicalTrafficBytes.push(matchingHistoricalRecord.bytes);
            matchIndex++;

          // Otherwise, push a zero
          } else {
            historicalTrafficBytes.push(0);
          }
        });

        let threshold              = 3;
        let numIterations          = Math.floor(trafficBytes.length / threshold);
        let numOrphans             = trafficBytes.length % threshold;
        let percentConsideredEqual = 0.1;

        // Average and compare traffic/historical bytes in groups of threshold
        for (let i = 0; i < numIterations; i++) {
          // If we're on the last loop iteration, lump the rest of records together
          let numRecords               = (i === numIterations - 1) ? threshold + numOrphans : threshold;
          let start                    = i * threshold;
          let end                      = start + numRecords;
          let averageTraffic           = _.mean(trafficBytes.slice(start, end));
          let averageHistoricalTraffic = _.mean(historicalTrafficBytes.slice(start, end));
          let marginOfEquality         = averageHistoricalTraffic * percentConsideredEqual;
          let lowerEqualityLimit       = averageHistoricalTraffic - marginOfEquality;
          let upperEqualityLimit       = averageHistoricalTraffic + marginOfEquality;
          let variance;

          if (_.inRange(averageTraffic, lowerEqualityLimit, upperEqualityLimit)) {
            variance = 0;
          } else if (averageTraffic > averageHistoricalTraffic) {
            variance = 1;
          } else if (averageTraffic < averageHistoricalTraffic) {
            variance = -1;
          }

          historicalVarianceData = historicalVarianceData.concat(_.fill(Array(numRecords), variance));
        }


        // Build the data object for a single level
        let levelData = {
          avg_cache_hit_rate: levelAggregateData.chit_ratio,
          avg_ttfb: `${Math.round(levelAggregateData.avg_fbl)} ms`,
          transfer_rates: transferRates,
          historical_variance: historicalVarianceData,
          traffic: levelTrafficDataFormatted,
          historical_traffic: levelHistoricalTrafficDataFormatted
        };

        // Dynamically set a "selectedLevel" property on the level data
        // e.g. levelData = {group: 3}, levelData = {property: 'idean.com'}
        levelData[selectedLevel] = level;

        // Push the object to the response data
        responseData.push(levelData);

      });


    }

    res.jsend(responseData);

    // res.jsend(testData({
    //   entityCount: 10,
    //   start: params.start,
    //   end: params.end
    // }));

  }).catch(() => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeMetrics;
