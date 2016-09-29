'use strict';

require('express-jsend');
let _         = require('lodash');
let db        = require('../../db');
let dataUtils = require('../../data-utils');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData  = require('./sp-contribution-data');

function routeTrafficServiceProvider(req, res) {
  log.info('Getting traffic/sp-contribution');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start          : {required: true, type: 'Timestamp'},
    end            : {required: false, type: 'Timestamp'},
    account        : {required: true, type: 'ID'},
    group          : {required: false, type: 'ID'},
    property       : {required: false, type: 'Property'},
    sp_account_ids : {required: false, type: 'List'},
    net_type       : {required: false, type: 'Net_Type'},
    service_type   : {required: false, type: 'Service'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start          : params.start,
    end            : params.end,
    account        : params.account,
    group          : params.group,
    property       : params.property,
    sp_account_ids : params.sp_account_ids && params.sp_account_ids.split(','),
    sp_group_ids   : params.sp_group_ids && params.sp_group_ids.split(','),
    net_type       : params.net_type,
    service_type   : params.service_type
  };

  let optionsFinal = db._getQueryOptions(options);
  let duration = optionsFinal.end - optionsFinal.start + 1;

  db.getSPContributionData(optionsFinal).spread((trafficData, countryData, totalBytes) => {
    let finalTrafficData = [];
    let groupingEntity = optionsFinal.sp_group_ids ? 'sp_group' : 'sp_account';
    let trafficDataGrouped = _.groupBy(trafficData, groupingEntity);
    let countryDataGrouped = _.groupBy(countryData, groupingEntity);

    _.forOwn(trafficDataGrouped, (data, sp_entity_id) => {
      let record = {};

      // HTTP traffic
      let httpTraffic       = _.filter(data, {service_type: 'http'});
      let httpOnNetTraffic  = _.find(httpTraffic, {net_type: 'on'});
      let httpOffNetTraffic = _.find(httpTraffic, {net_type: 'off'});
      let httpOnNetBytes    = _.get(httpOnNetTraffic, 'bytes', null);
      let httpOffNetBytes   = _.get(httpOffNetTraffic, 'bytes', null);

      // HTTPS traffic
      let httpsTraffic       = _.filter(data, {service_type: 'https'});
      let httpsOnNetTraffic  = _.find(httpsTraffic, {net_type: 'on'});
      let httpsOffNetTraffic = _.find(httpsTraffic, {net_type: 'off'});
      let httpsOnNetBytes    = _.get(httpsOnNetTraffic, 'bytes', null);
      let httpsOffNetBytes   = _.get(httpsOffNetTraffic, 'bytes', null);

      record[groupingEntity] = sp_entity_id;

      record.http = {
        net_on_bytes: httpOnNetBytes,
        net_off_bytes: httpOffNetBytes,
        net_on_bps: dataUtils.getBPSFromBytes(httpOnNetBytes, duration),
        net_off_bps: dataUtils.getBPSFromBytes(httpOffNetBytes, duration)
      };

      record.https = {
        net_on_bytes: httpsOnNetBytes,
        net_off_bytes: httpsOffNetBytes,
        net_on_bps: dataUtils.getBPSFromBytes(httpsOnNetBytes, duration),
        net_off_bps: dataUtils.getBPSFromBytes(httpsOffNetBytes, duration)
      };

      record.countries = countryDataGrouped[sp_entity_id].map(countryRecord => {
        return {
          name: dataUtils.getCountryNameFromCode(countryRecord.country),
          code: dataUtils.get3CharCountryCodeFromCode(countryRecord.country),
          bytes: countryRecord.bytes,
          bits_per_second: dataUtils.getBPSFromBytes(countryRecord.bytes, duration),
          percent_total: parseFloat((countryRecord.bytes / totalBytes).toFixed(4))
        }
      });

      finalTrafficData.push(record);
    })

    res.jsend(finalTrafficData);

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTrafficServiceProvider;
