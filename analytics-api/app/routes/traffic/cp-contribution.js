'use strict';

require('express-jsend');
let db        = require('../../db');
let dataUtils = require('../../data-utils');
let log       = require('../../logger');
let validator = require('../../validator');

function routeTrafficCPContribution(req, res) {
  log.info('Getting traffic/cp-contribution');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start          : {required: true, type: 'Timestamp'},
    end            : {required: false, type: 'Timestamp'},
    sp_account     : {required: true, type: 'ID'},
    sp_group       : {required: false, type: 'ID'},
    asset          : {required: false, type: 'Property'},
    account_ids    : {required: false, type: 'List'},
    group_ids      : {required: false, type: 'List'},
    properties     : {required: false, type: 'List'},
    net_type       : {required: false, type: 'Net_Type'},
    service_type   : {required: false, type: 'Service'}
  });

  // Extra custom parameter validation
  if (!errors) {
    let customErrors = [];
    let invalidParamsSent = !!(
      params.account ||
      params.group ||
      params.property ||
      params.sp_account_ids ||
      params.sp_group_ids ||
      params.assets
    );

    invalidParamsSent && customErrors.push(
      'You may not pass the account, group, property, sp_account_ids, sp_group_ids, or assets params.'
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
    sp_account     : params.sp_account,
    sp_group       : params.sp_group,
    asset          : params.asset,
    account_ids    : params.account_ids && params.account_ids.split(','),
    group_ids      : params.group_ids && params.group_ids.split(','),
    properties     : params.properties && params.properties.split(','),
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

module.exports = routeTrafficCPContribution;
