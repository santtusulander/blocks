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
  let isListingChildren = _.isUndefined(params.list_children) ? true : params.list_children === 'true';

  let errors = validator.validate(params, {
    start         : {required: true, type: 'Timestamp'},
    end           : {required: false, type: 'Timestamp'},
    account       : {required: !isListingChildren, type: 'ID'},
    group         : {required: false, type: 'ID'},
    account_min   : {required: false, type: 'ID'},
    account_max   : {required: false, type: 'ID'},
    list_children : {required: false, type: 'Boolean'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start         : params.start,
    end           : params.end,
    account       : params.account,
    group         : params.group,
    account_min   : params.account_min,
    account_max   : params.account_max,
    list_children : isListingChildren
  };

  db.getMetrics(options).spread((trafficDataRaw, historicalTrafficDataRaw, aggregateDataRaw, spAggregateDataRaw, spTrafficDataRaw, spHistoricalTrafficDataRaw) => {
    let responseData = [];

    if (trafficDataRaw && historicalTrafficDataRaw && aggregateDataRaw) {
      let trafficData = trafficDataRaw.concat(spTrafficDataRaw);
      let historicalTrafficData = historicalTrafficDataRaw.concat(spHistoricalTrafficDataRaw);
      let aggregateData = aggregateDataRaw.concat(spAggregateDataRaw);

      let optionsFinal    = db._getQueryOptions(options);
      let startTime       = parseInt(optionsFinal.start);
      let endTime         = parseInt(optionsFinal.end);
      let duration        = endTime - startTime + 1;
      let optionsHistoric = Object.assign({}, optionsFinal, {
        start: startTime - duration,
        end: startTime - 1
      });

      // Set the selected level
      let selectedLevel = db._getAccountLevel(optionsFinal);

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

        levelTrafficDataFormatted = dataUtils.buildContiguousTimeline(
          levelTrafficDataFormatted, optionsFinal.start, optionsFinal.end, optionsFinal.granularity, 'bytes'
        );

        levelHistoricalTrafficDataFormatted = dataUtils.buildContiguousTimeline(
          levelHistoricalTrafficDataFormatted, optionsHistoric.start, optionsHistoric.end, optionsHistoric.granularity, 'bytes'
        );

        // Add bits per second to the traffic data
        levelTrafficDataFormatted.forEach((record) => {
          record.bits_per_second = dataUtils.getBPSFromBytes(record.bytes, optionsFinal.granularity);
        });

        levelHistoricalTrafficDataFormatted.forEach((record) => {
          record.bits_per_second = dataUtils.getBPSFromBytes(record.bytes, optionsHistoric.granularity);
        });

        // Calculate historical variance
        let historicalVarianceData = [];

        // The historical data is from the duration of time prior to the
        // requested time range.
        let trafficBytes           = levelTrafficDataFormatted.map((record) => record.bytes);
        let historicalTrafficBytes = levelHistoricalTrafficDataFormatted.map((record) => record.bytes);

        let threshold              = 24;
        let numIterations          = Math.floor(trafficBytes.length / threshold);
        let numOrphans             = trafficBytes.length % threshold;
        let percentConsideredEqual = 0.1;

        // Average and compare traffic/historical bytes in groups of threshold
        for (let i = 0; i < numIterations; i++) {
          // If we're on the last loop iteration, lump the rest of records together
          let numRecords               = (i === numIterations - 1) ? threshold + numOrphans : threshold;
          let start                    = i * threshold;
          let end                      = start + numRecords;
          let trafficSlice             = trafficBytes.slice(start, end);
          let historicalTrafficSlice   = historicalTrafficBytes.slice(start, end);
          let trafficNulls             = trafficSlice.filter((bytes) => bytes === null);
          let historicalTrafficNulls   = historicalTrafficSlice.filter((bytes) => bytes === null);
          let averageTraffic           = _.mean(trafficSlice);
          let averageHistoricalTraffic = _.mean(historicalTrafficSlice);
          averageTraffic               = trafficNulls.length >= (threshold / 2) ? null : averageTraffic;
          averageHistoricalTraffic     = historicalTrafficNulls.length >= (threshold / 2) ? null : averageHistoricalTraffic;
          let marginOfEquality         = averageHistoricalTraffic * percentConsideredEqual;
          let lowerEqualityLimit       = averageHistoricalTraffic - marginOfEquality;
          let upperEqualityLimit       = averageHistoricalTraffic + marginOfEquality;
          let variance;

          if (averageTraffic === null || averageHistoricalTraffic === null) {
            variance = null;
          } else if (_.inRange(averageTraffic, lowerEqualityLimit, upperEqualityLimit)) {
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
          historical_variance: historicalVarianceData.reverse(),
          traffic: levelTrafficDataFormatted.reverse(),
          historical_traffic: levelHistoricalTrafficDataFormatted.reverse()
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

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeMetrics;
