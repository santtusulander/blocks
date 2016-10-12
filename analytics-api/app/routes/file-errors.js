'use strict';

require('express-jsend');
let _         = require('lodash');
let log       = require('../logger');
let db        = require('../db');
let validator = require('../validator');
// let testData  = require('./file-errors-data');

function routeFileErrors(req, res) {
  log.info('Getting file-errors');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
    status_codes : {required: false, type: 'Status_Codes'},
    service_type : {required: false, type: 'Service'}
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
    status_codes : params.status_codes && params.status_codes.split(','),
    service_type : params.service_type
  };

  db.getFileErrors(options).then((fileErrorData) => {
    let responseData   = {};
    let numStatusCodes = {};
    let statusCodes    = _.uniq(fileErrorData.map((record) => record.status_code));

    // Count the number of each status code broken down by service type
    statusCodes.forEach((code) => {
      let httpRecordCount = fileErrorData.filter((record) => {
        return record.service_type === 'http' && record.status_code === code
      }).length;

      let httpsRecordCount = fileErrorData.filter((record) => {
        return record.service_type === 'https' && record.status_code === code
      }).length;

      let counts = {
        http:  httpRecordCount,
        https: httpsRecordCount,
        total: httpRecordCount + httpsRecordCount
      };

      numStatusCodes['e' + code] = counts;
    });

    // Build and send the final response data
    responseData.num_errors  = numStatusCodes;
    responseData.url_details = fileErrorData;

    res.jsend(responseData);

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeFileErrors;
