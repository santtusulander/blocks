'use strict';

let _ = require('lodash');
const minBytes = 108000000000000;
const maxBytes = 270000000000000;
const minCacheHitRate = 50;
const maxCacheHitRate = 90;
const minTransferRate = 5;
const maxTransferRate = 20;


function generateTrafficData(start, numRecords, timeInterval) {
  let data = [];

  while (numRecords--) {
    data.push({
      bytes: _.random(minBytes, maxBytes),
      timestamp: start
    });
    start += timeInterval;
  }

  return data;
}

module.exports = function testData(options) {
  const numHoursPerRecord = 3;
  const secondsPerDay     = 86400;
  const timeInterval      = 3600 * numHoursPerRecord; // 3 hours in seconds
  const varianceSmoothing = 3;
  let start               = parseInt(options.start);
  let end                 = parseInt(options.end);
  let entityCount         = options.entityCount;
  let numDays             = Math.ceil((end - start) / secondsPerDay);
  let numRecords          = numDays * (24/numHoursPerRecord);
  let historicStart       = start - (numDays * 86400);
  let responseData        = [];

  while (entityCount--) {
    let trafficData            = generateTrafficData(start, numRecords, timeInterval);
    let historicalData         = generateTrafficData(historicStart, numRecords, timeInterval);
    let historicalVarianceData = [];

    // Calculate historical variance
    let numItems      = numDays;
    let counter       = 0;
    let varianceValue = _.random(-1, 1);
    while (numItems--) {
      varianceValue = (counter % varianceSmoothing) === 0 ? _.random(-1, 1) : varianceValue;
      historicalVarianceData.push(varianceValue);
      counter++;
    }

    let entityData = {
      group_id: entityCount + 1,
      avg_cache_hit_rate: _.random(minCacheHitRate, maxCacheHitRate),
      transfer_rates: {
        peak:    `${_.random(minTransferRate, maxTransferRate, true).toFixed(1)} Gbps`,
        lowest:  `${_.random(minTransferRate, maxTransferRate, true).toFixed(1)} Gbps`,
        average: `${_.random(minTransferRate, maxTransferRate, true).toFixed(1)} Gbps`
      },
      historical_variance: historicalVarianceData,
      traffic: trafficData,
      historical_traffic: historicalData
    }

    responseData.push(entityData);
  }

  return responseData;
}
