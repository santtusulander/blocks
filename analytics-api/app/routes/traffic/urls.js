'use strict';

require('express-jsend');
let log       = require('../../logger');
let db        = require('../../db');
let validator = require('../../validator');
let testData  = require('./urls-data');

function routeTrafficUrls(req, res) {
  log.info('Getting traffic/urls');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: false, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
    status_codes : {required: false, type: 'Status_Codes'},
    service_type : {required: false, type: 'Service'},
    sort_by      : {required: false, type: 'Sort_By'},
    sort_dir     : {required: false, type: 'Sort_Dir'},
    limit        : {required: false, type: 'Number'}
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
    service_type : params.service_type,
    sort_by      : params.sort_by,
    sort_dir     : params.sort_dir,
    limit        : params.limit
  };


  return res.jsend(testData);
  /* eslint no-unreachable: 0 */

  db.getTrafficByUrl(options).then((trafficData) => {
    res.jsend(trafficData);
  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeTrafficUrls;
