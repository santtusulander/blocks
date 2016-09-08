'use strict';

require('express-jsend');
let _         = require('lodash');
let db        = require('../../db');
let dataUtils = require('../../data-utils');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData  = require('./on-off-net-data');

/**
 * Build a net_on/net_off record that includes bytes and percent_total.
 *
 * @param  {number} bytes The amount of bytes for net_on/net_off
 * @param  {number} total The total amount of bytes for net_on and net_off
 * @return {object}       An object that contains the bytes and percent_total
 */
function buildNetRecord(bytes, total) {
  return {
    bytes: bytes,
    percent_total: parseFloat((bytes / total).toFixed(4))
  }
}

function routeTrafficOnOffNet(req, res) {
  log.info('Getting traffic/on-off-net');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    asset        : {required: false, type: 'Property'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start        : params.start,
    end          : params.end,
    account      : params.account,
    group        : params.group,
    asset        : params.asset
  };

  let optionsFinal = db._getQueryOptions(options);

  db.getOnOffNetTraffic(optionsFinal).then((trafficData) => {
    let trafficDataGrouped = _.groupBy(trafficData, 'timestamp');
    let finalTrafficData = {
      detail: [],
      net_off: {},
      net_on: {},
      total: 0
    };

    let grandTotal = 0;
    let grandTotalOn = 0;
    let grandTotalOff = 0;

    // Build the detail records
    _.forOwn(trafficDataGrouped, (data, timestamp) => {
      let record = {};
      let onNetRecord = _.find(data, {net_type: 'on'});
      let offNetRecord = _.find(data, {net_type: 'off'});
      let onNetBytes = _.get(onNetRecord, ['bytes'], 0);
      let offNetBytes = _.get(offNetRecord, ['bytes'], 0);
      let total = onNetBytes + offNetBytes;

      // Add to the grand totals
      grandTotalOn += onNetBytes;
      grandTotalOff += offNetBytes;
      grandTotal += total;

      // Create a single record for the current timestamp
      record.timestamp = timestamp;
      record.total = total;
      record.net_on = buildNetRecord(onNetBytes, total);
      record.net_off = buildNetRecord(offNetBytes, total);

      finalTrafficData.detail.push(record);
    });

    // Add the totals to the response
    finalTrafficData.net_on = buildNetRecord(grandTotalOn, grandTotal);
    finalTrafficData.net_off = buildNetRecord(grandTotalOff, grandTotal);
    finalTrafficData.total = grandTotal;

    // Fill the details array with null records for missing timestamps
    finalTrafficData.detail = dataUtils.buildContiguousTimeline(
      finalTrafficData.detail,
      optionsFinal.start,
      optionsFinal.end,
      'day',
      ['net_off', 'net_on', 'total']
    );

    res.jsend(finalTrafficData);

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });


}

module.exports = routeTrafficOnOffNet;
