'use strict';

require('express-jsend');
let db        = require('../../db');
let dataUtils = require('../../data-utils');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData  = require('./sp-contribution-data');

function routeTrafficSPContribution(req, res) {
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
    sp_group_ids   : {required: false, type: 'List'},
    assets         : {required: false, type: 'List'},
    net_type       : {required: false, type: 'Net_Type'},
    service_type   : {required: false, type: 'Service'}
  });

  // Extra custom parameter validation
  if (!errors) {
    let customErrors = [];
    let invalidParamsSent = !!(
      params.sp_account ||
      params.sp_group ||
      params.asset ||
      params.account_ids ||
      params.group_ids ||
      params.properties
    );

    invalidParamsSent && customErrors.push(
      'You may not pass the sp_account, sp_group, asset, account_ids, group_ids, or properties params.'
    );

    if (customErrors.length) {
      errors = customErrors;
    }
  }

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
    assets         : params.assets && params.assets.split(','),
    net_type       : params.net_type,
    service_type   : params.service_type
  };

  let optionsFinal = db._getQueryOptions(options);
  let duration = optionsFinal.end - optionsFinal.start + 1;
  let groupingEntity = dataUtils.getGroupingEntityForContributionReport(optionsFinal);
  optionsFinal.groupingEntity = groupingEntity;

  db.getContributionData(optionsFinal).spread((trafficData, countryData, totalBytes) => {
    let finalTrafficData = dataUtils.processContributionData(
      duration,
      groupingEntity,
      trafficData,
      countryData,
      totalBytes
    );

    res.jsend(finalTrafficData);

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTrafficSPContribution;
