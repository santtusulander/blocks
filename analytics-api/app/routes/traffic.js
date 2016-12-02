'use strict';

require('express-jsend');
let _         = require('lodash');
let moment    = require('moment');
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
  let fieldFilters      = _.isUndefined(params.field_filters) ? [] : params.field_filters.split(',');

  let errors = validator.validate(params, {
    start         : {required: true, type: 'Timestamp'},
    end           : {required: false, type: 'Timestamp'},
    account       : {required: !isListingChildren, type: 'ID'},
    group         : {required: false, type: 'ID'},
    property      : {required: false, type: 'Property'},
    service_type  : {required: false, type: 'Service'},
    granularity   : {required: false, type: 'Granularity'},
    resolution    : {required: false, type: 'Granularity'},
    list_children : {required: false, type: 'Boolean'},
    show_detail   : {required: false, type: 'Boolean'},
    show_totals   : {required: false, type: 'Boolean'},
    field_filters : {required: false, type: 'List'}
  });

  // Extra custom parameter validation
  if (!errors) {
    let granularitySeconds = dataUtils.secondsPerGranularity[params.granularity || 'hour'];
    let resolutionSeconds  = dataUtils.secondsPerGranularity[params.resolution || 'hour'];
    if (resolutionSeconds > granularitySeconds) {
      errors = [`Error with resolution/granularity parameter: The resolution parameter must be smaller than the granularity parameter. Granularity value received: ${params.granularity} — Resolution value received: ${params.resolution}`];
    }
  }

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
    resolution    : params.resolution,
    service_type  : params.service_type,
    list_children : isListingChildren,
    show_detail   : showDetail,
    show_totals   : showTotals
  };

  let optionsFinal = db._getQueryOptions(options);
  let resolution = optionsFinal.resolution || optionsFinal.granularity;

  db.getTrafficWithTotals(optionsFinal).spread((totalsData, detailData, spDataTotals, spDataDetail) => {
    let duration      = optionsFinal.end - optionsFinal.start + 1;
    let selectedLevel = db._getAccountLevel(optionsFinal);

    totalsData = totalsData.concat(spDataTotals);
    detailData = detailData.concat(spDataDetail);

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
        record.totals = fieldFilters.length ? _.pick(record.totals, fieldFilters) : record.totals;
      }

      // Conditionally add totals to the entity record based on the show_totals param
      if (optionsFinal.show_detail && detailData) {
        // Get the array of detail data for the current entity
        // NOTE: This will return one record per resolution, not granularity (e.g. month, day, hour, 5min)
        let entityDetailData = detailData.filter((record) => record[selectedLevel] === entity);
        let entityDetailDataFilled = dataUtils.buildContiguousTimeline(
          entityDetailData,
          optionsFinal.start,
          optionsFinal.end,
          resolution,
          [
            'chit_ratio', 'avg_fbl',
            'bytes', 'bytes_average', 'bytes_lowest', 'bytes_peak',
            'requests', 'requests_average', 'requests_lowest', 'requests_peak',
            'connections', 'connections_average', 'connections_lowest', 'connections_peak'
          ]
        );

        // Populate entityDetailDataFilled with the number of records specified by granularity.
        // This will only be done if resolution is smaller than granularity.
        // For example, the caller want to use hourly data aggregated by day — meaning
        // the granularity would be day, and the resolution would be hour.
        if (resolution !== optionsFinal.granularity) {
          let entityDetailDataGrouped = {};

          // Create an object where each key is a UTC unix timestamp reresenting
          // the start of the boundary defined by granularity (e.g. one per day).
          entityDetailDataFilled.forEach((detailRecordData) => {
            let time = moment.unix(detailRecordData.timestamp).utc();
            let boundary = time.startOf(optionsFinal.granularity).format('X');

            if (!entityDetailDataGrouped[boundary]) {
              entityDetailDataGrouped[boundary] = [detailRecordData];
            } else {
              entityDetailDataGrouped[boundary].push(detailRecordData);
            }
          });

          // Aggregate all the grouped data into a new array of objects that each
          // represent a period of time defined by granularity (e.g. one per day).
          entityDetailDataFilled = [];
          _.forOwn(entityDetailDataGrouped, (records, timestamp) => {
            let bytesSum       = _.sumBy(records, (record) => record.bytes);
            let bytesMax       = _.maxBy(records, (record) => record.bytes);
            bytesMax           = bytesMax ? bytesMax.bytes : null;
            let bytesMin       = _.minBy(records, (record) => record.bytes);
            bytesMin           = bytesMin ? bytesMin.bytes : null;
            let bytesAvg       = _.meanBy(records, (record) => record.bytes);
            let requestsSum    = _.sumBy(records, (record) => record.requests);
            let requestsMax    = _.maxBy(records, (record) => record.requests);
            requestsMax        = requestsMax ? requestsMax.requests : null;
            let requestsMin    = _.minBy(records, (record) => record.requests);
            requestsMin        = requestsMin ? requestsMin.requests : null;
            let requestsAvg    = _.meanBy(records, (record) => record.requests);
            let connectionsSum = _.sumBy(records, (record) => record.connections);
            let connectionsMax = _.maxBy(records, (record) => record.connections);
            connectionsMax     = connectionsMax ? connectionsMax.connections : null;
            let connectionsMin = _.minBy(records, (record) => record.connections);
            connectionsMin     = connectionsMin ? connectionsMin.connections : null;
            let connectionsAvg = _.meanBy(records, (record) => record.connections);

            let aggregateRecord = {
              timestamp           : Number(timestamp),
              bytes               : bytesSum,
              bytes_peak          : bytesMax,
              bytes_lowest        : bytesMin,
              bytes_average       : Math.round(bytesAvg),
              requests            : requestsSum,
              requests_peak       : requestsMax,
              requests_lowest     : requestsMin,
              requests_average    : Math.round(requestsAvg),
              connections         : connectionsSum,
              connections_peak    : connectionsMax,
              connections_lowest  : connectionsMin,
              connections_average : Math.round(connectionsAvg)
            };

            entityDetailDataFilled.push(aggregateRecord);

          });

        }

        // Maniplulate each detail record
        record.detail = entityDetailDataFilled.map((detailRecordData) => {
          let detailRecord = {
            timestamp     : detailRecordData.timestamp,
            bytes: {
              total   : detailRecordData.bytes,
              peak    : detailRecordData.bytes_peak,
              low     : detailRecordData.bytes_lowest,
              average : detailRecordData.bytes_average
            },
            transfer_rates: {
              total   : dataUtils.getBPSFromBytes(detailRecordData.bytes, resolution),
              peak    : dataUtils.getBPSFromBytes(detailRecordData.bytes_peak, resolution),
              low     : dataUtils.getBPSFromBytes(detailRecordData.bytes_lowest, resolution),
              average : dataUtils.getBPSFromBytes(detailRecordData.bytes_average, resolution)
            },
            requests: {
              total   : detailRecordData.requests,
              peak    : detailRecordData.requests_peak,
              low     : detailRecordData.requests_lowest,
              average : detailRecordData.requests_average
            },
            connections: {
              total   : detailRecordData.connections,
              peak    : detailRecordData.connections_peak,
              low     : detailRecordData.connections_lowest,
              average : detailRecordData.connections_average
            }
          };

          // We can only provide chit_ratio and avg_fbl if we didn't previously
          // aggregate numbers for each granularity interval.
          if (resolution === optionsFinal.granularity) {
            detailRecord.chit_ratio = detailRecordData.chit_ratio;
            detailRecord.avg_fbl    = detailRecordData.avg_fbl === null ? null : `${Math.round(detailRecordData.avg_fbl)} ms`;
          }

          // Add the current detail record to the detail array
          detailRecord = _.defaultsDeep(detailRecord, defaultTotals);
          detailRecord = fieldFilters.length ? _.pick(detailRecord, fieldFilters) : detailRecord;
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
