'use strict';

require('express-jsend');
let _         = require('lodash');
let log       = require('../logger');
let dataUtils = require('../data-utils');
let db        = require('../db');
let validator = require('../validator');

function routeTraffic(req, res) {
  log.info('Getting traffic');
  log.debug('query params:', req.query);

  let params            = req.query;
  let isListingChildren = _.isUndefined(params.list_children) ? false : params.list_children === 'true';
  let showDetail        = _.isUndefined(params.show_detail) ? true : params.show_detail === 'true';
  let showTotals        = _.isUndefined(params.show_totals) ? true : params.show_totals === 'true';

  let errors = validator.validate(params, {
    start         : {required: true, type: 'Timestamp'},
    end           : {required: false, type: 'Timestamp'},
    account       : {required: !isListingChildren, type: 'ID'},
    group         : {required: false, type: 'ID'},
    property      : {required: false, type: 'Property'},
    service_type  : {required: false, type: 'Service'},
    granularity   : {required: false, type: 'Granularity'},
    list_children : {required: false, type: 'Boolean'},
    show_detail   : {required: false, type: 'Boolean'},
    show_totals   : {required: false, type: 'Boolean'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start         : params.start,
    end           : params.end,
    account       : params.account,
    group         : params.group,
    property      : params.property,
    granularity   : params.granularity,
    service_type  : params.service_type,
    list_children : isListingChildren,
    show_detail   : showDetail,
    show_totals   : showTotals
  };

  let optionsFinal = db._getQueryOptions(options);

  db.getTrafficWithTotals(optionsFinal).spread((totalsData, detailData) => {
    let duration      = optionsFinal.end - optionsFinal.start + 1;
    let selectedLevel = db._getAccountLevel(optionsFinal, isListingChildren);
    let entityList    = totalsData.length ? totalsData : detailData;
    let entities      = entityList && _.uniq(entityList.map((row) => row[selectedLevel]));

    let defaultTotals = {
      chit_ratio : null,
      avg_fbl    : null,
      bytes: {
        total   : null,
        peak    : null,
        low     : null,
        average : null
      },
      transfer_rates: {
        total   : null,
        peak    : null,
        low     : null,
        average : null
      },
      requests: {
        total   : null,
        peak    : null,
        low     : null,
        average : null
      },
      connections: {
        total   : null,
        peak    : null,
        low     : null,
        average : null
      }
    };

    let responseData = [];

    // Loop each entity and build an object of data that includes traffic
    // data, average cache hit ratio, and transfer rates.
    entities && entities.forEach((entity) => {

      let record = {};

      // Dynamically set a "selectedLevel" property on the level data
      // e.g. record.group = 3, record.property = 'idean.com', etc...
      record[selectedLevel] = entity;

      // Ensure a consistent data structure by always having the detail and totals properties
      record.totals = {};
      record.detail = [];

      // Conditionally add totals to the entity record based on the show_totals param
      if (optionsFinal.show_totals && totalsData) {
        let entityTotalsData = totalsData.filter((record) => record[selectedLevel] === entity)[0];

        record.totals = {
          chit_ratio : entityTotalsData.chit_ratio,
          avg_fbl    : `${Math.round(entityTotalsData.avg_fbl)} ms`,
          bytes: {
            total   : entityTotalsData.bytes,
            peak    : entityTotalsData.bytes_peak,
            low     : entityTotalsData.bytes_lowest,
            average : entityTotalsData.bytes_average
          },
          transfer_rates: {
            total   : dataUtils.getBPSFromBytes(entityTotalsData.bytes, duration),
            peak    : dataUtils.getBPSFromBytes(entityTotalsData.bytes_peak, optionsFinal.granularity),
            low     : dataUtils.getBPSFromBytes(entityTotalsData.bytes_lowest, optionsFinal.granularity),
            average : dataUtils.getBPSFromBytes(entityTotalsData.bytes_average, optionsFinal.granularity)
          },
          requests: {
            total   : entityTotalsData.requests,
            peak    : entityTotalsData.requests_peak,
            low     : entityTotalsData.requests_lowest,
            average : entityTotalsData.requests_average
          },
          connections: {
            total   : entityTotalsData.connections,
            peak    : entityTotalsData.connections_peak,
            low     : entityTotalsData.connections_lowest,
            average : entityTotalsData.connections_average
          }
        };

        // Ensure proper defaults
        record.totals = _.defaultsDeep(record.totals, defaultTotals);
      }

      // Conditionally add totals to the entity record based on the show_totals param
      if (optionsFinal.show_detail && detailData) {

        // Get the array of detail data for the current entity
        let entityDetailData = detailData.filter((record) => record[selectedLevel] === entity);
        let entityDetailDataFilled = dataUtils.buildContiguousTimeline(
          entityDetailData,
          optionsFinal.start,
          optionsFinal.end,
          optionsFinal.granularity,
          ['chit_ratio', 'avg_fbl', 'bytes', 'transfer_rate', 'requests', 'connections']
        );

        // Maniplulate each detail record
        record.detail = entityDetailDataFilled.map((detailRecordData) => {
          let detailRecord = {
            timestamp     : detailRecordData.timestamp,
            chit_ratio    : detailRecordData.chit_ratio,
            avg_fbl       : detailRecordData.avg_fbl,
            bytes         : detailRecordData.bytes,
            transfer_rate : dataUtils.getBPSFromBytes(detailRecordData.bytes, optionsFinal.granularity),
            requests      : detailRecordData.requests,
            connections   : detailRecordData.connections
          };

          // Add the current detail record to the detail array
          return detailRecord;
        });
      }

      // Add the record for the current entity to the response data
      responseData.push(record);
    });

    res.jsend(responseData);

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTraffic;
