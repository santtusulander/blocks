'use strict';

require('express-jsend');
let _         = require('lodash');
let log       = require('../logger');
let dataUtils = require('../data-utils')
let db        = require('../db');
let validator = require('../validator');

function routeSpDashboard(req, res) {
  log.info('Getting sp-dashboard');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    granularity  : {required: false, type: 'SP_Granularity'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start        : params.start,
    end          : params.end,
    account      : params.account,
    group        : params.group,
    granularity  : params.granularity
  };

  db.getSpDashboardMetrics(options).spread((globalData, countryData, providerData) => {
    const duration = options.end - options.start + 1;
    const secondsPerGranularity = dataUtils.secondsPerGranularity[options.granularity];
    let finalData = {
      traffic: {
        bytes: 0,
        bytes_net_on: 0,
        bytes_net_off: 0,
        detail: []
      },
      bandwidth: {
        bits_per_second: 0,
        detail: []
      },
      latency: {
        avg_fbl: '',
        detail: []
      },
      connections: {
        connections: 0,
        connections_per_second: 0,
        detail: []
      },
      cache_hit: {
        chit_ratio: 0,
        detail: []
      },
      countries: [],
      providers: {
        bytes: 0,
        bits_per_second: 0,
        detail: []
      }
    }

    // Process data for traffic, bandwidth, latency, connections, and cache_hit
    // =============================================================================================
    let bytesTotal        = 0;
    let bytesOnNetTotal   = 0;
    let bytesOffNetTotal  = 0;
    let connectionsTotal  = 0;
    let chitRatioTotal    = 0;
    let avgFBLTotal       = 0;
    let detail            = [];
    let fullDetail        = [];
    let globalDataGrouped = _.groupBy(globalData, 'timestamp');

    // The data is grouped by timestamp because the data is grouped by timestamp
    // and net_type. Calculating latency and cache hit data requires that we look
    // at each timestamp and manually sum/avg data for the on net and off net records.
    // NOTE: There may or may not be two net type records for a given timestamp.
    _.forEach(globalDataGrouped, (records, timestamp) => {
      let bytes           = 0;
      let bytesOnNet      = 0;
      let bytesOffNet     = 0;
      let connections     = 0;
      let chitRatio       = 0;
      let avgFBL          = 0;
      let chitRatioOnNet  = 0;
      let chitRatioOffNet = 0;
      let avgFBLOnNet     = 0;
      let avgFBLOffNet    = 0;

      // Iterate over the on/off net records for a given timestamp
      records.forEach(record => {
        bytes       += record.bytes;
        connections += record.connections;

        if (record.net_type === 'on') {
          bytesOnNet     = record.bytes;
          chitRatioOnNet = record.chit_ratio * record.connections;
          avgFBLOnNet    = record.avg_fbl * record.connections;
        }

        if (record.net_type === 'off') {
          bytesOffNet     = record.bytes;
          chitRatioOffNet = record.chit_ratio * record.connections;
          avgFBLOffNet    = record.avg_fbl * record.connections;
        }
      });

      // Calculate the weighted metrics
      chitRatio = Math.round((chitRatioOnNet + chitRatioOffNet) / connections);
      avgFBL = Math.round((avgFBLOnNet + avgFBLOffNet) / connections);

      // Build a big detail array with all the metrics
      detail.push({
        timestamp: parseInt(timestamp),
        bytes: bytes,
        bytes_net_on: bytesOnNet,
        bytes_net_off: bytesOffNet,
        bits_per_second: dataUtils.getBPSFromBytes(bytes, options.granularity),
        connections: connections,
        connections_per_second: parseFloat((connections / secondsPerGranularity).toFixed(4)),
        chit_ratio: chitRatio,
        avg_fbl: avgFBL
      })

      // Calculate Totals
      bytesTotal       += bytes;
      bytesOnNetTotal  += bytesOnNet;
      bytesOffNetTotal += bytesOffNet;
      connectionsTotal += connections;
      chitRatioTotal   += chitRatio * connections;
      avgFBLTotal      += avgFBL * connections;

    });

    // Pad the detail array with missing timestamp records
    fullDetail = dataUtils.buildContiguousTimeline(
      detail,
      options.start,
      options.end,
      options.granularity,
      ['bytes', 'bytes_net_on', 'bytes_net_off', 'bits_per_second', 'connections', 'connections_per_second', 'chit_ratio', 'avg_fbl']
    );

    // Populate Final Detail Data
    fullDetail.forEach(record => {
      let { timestamp, bytes, bytes_net_on, bytes_net_off, bits_per_second, connections, connections_per_second, chit_ratio, avg_fbl } = record;
      finalData.traffic.detail.push({timestamp, bytes, bytes_net_on, bytes_net_off});
      finalData.bandwidth.detail.push({timestamp, bits_per_second});
      finalData.latency.detail.push({timestamp, avg_fbl});
      finalData.connections.detail.push({timestamp, connections, connections_per_second});
      finalData.cache_hit.detail.push({timestamp, chit_ratio});
    });

    // Populate Final Totals Data
    finalData.traffic.bytes                      = bytesTotal;
    finalData.traffic.bytes_net_on               = bytesOnNetTotal;
    finalData.traffic.bytes_net_off              = bytesOffNetTotal;
    finalData.bandwidth.bits_per_second          = dataUtils.getBPSFromBytes(bytesTotal, duration);
    finalData.latency.avg_fbl                    = `${Math.round(avgFBLTotal / connectionsTotal)} ms`;
    finalData.connections.connections            = connectionsTotal;
    finalData.connections.connections_per_second = parseFloat((connectionsTotal / duration).toFixed(4));
    finalData.cache_hit.chit_ratio               = Math.round(chitRatioTotal / connectionsTotal);


    // Process country data
    // =============================================================================================
    let countryDetail = countryData.map(record => {
      let { code, bytes } = record;
      return {
        code: dataUtils.get3CharCountryCodeFromCode(code),
        name: dataUtils.getCountryNameFromCode(code),
        bytes,
        bits_per_second: dataUtils.getBPSFromBytes(bytes, duration)
      }
    });

    finalData.countries = countryDetail;


    res.jsend({finalData, countryData, providerData});

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeSpDashboard;
