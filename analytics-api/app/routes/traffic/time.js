'use strict';

require('express-jsend');
let _         = require('lodash');
let dataUtils = require('../../data-utils');
let db        = require('../../db');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData  = require('./time-data');

function routeTrafficTime(req, res) {
  log.info('Getting traffic/time');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
    service_type : {required: false, type: 'Service'},
    granularity  : {required: false, type: 'Granularity'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start        : params.start,
    end          : params.end,
    account      : params.account,
    group        : params.group,
    property     : params.property,
    service_type : params.service_type,
    granularity  : params.granularity,
    dimension    : 'global'
  };

  db.getTime(options).then((trafficData) => {
    let optionsFinal       = db._getQueryOptions(options);
    let finalTrafficData   = trafficData.map((data) => _.pick(data, ['timestamp', 'service_type', 'bytes', 'requests']));
    let groupedTrafficData = _.groupBy(finalTrafficData, 'service_type');
    let filledTrafficData  = _.mapValues(groupedTrafficData, (data) => {
      return dataUtils.buildContiguousTimeline(
        data, optionsFinal.start, optionsFinal.end, optionsFinal.granularity, ['bytes', 'requests']
      );
    });

    finalTrafficData = [];
    _.mapValues(filledTrafficData, (data) => finalTrafficData = finalTrafficData.concat(data));
    finalTrafficData = _.sortBy(finalTrafficData, 'timestamp');

    // Add bits per second to each traffic record
    finalTrafficData = finalTrafficData.map((record) => {
      record.bits_per_second = dataUtils.getBPSFromBytes(record.bytes, optionsFinal.granularity);
      return record;
    });

    res.jsend(finalTrafficData);

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });
}

module.exports = routeTrafficTime;
