'use strict';

require('express-jsend');
let _         = require('lodash');
let dataUtils = require('../../data-utils');
let db        = require('../../db');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData = require('./time-data');

function routeVisitorsTime(req, res) {
  log.info('Getting visitors/time');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start        : {required: true, type: 'Timestamp'},
    end          : {required: false, type: 'Timestamp'},
    account      : {required: true, type: 'ID'},
    group        : {required: false, type: 'ID'},
    property     : {required: false, type: 'Property'},
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
    granularity  : params.granularity,
    dimension    : 'global'
  };

  db.getVisitors(options).then((visitorData) => {
    let optionsFinal      = db._getQueryOptions(options);
    let finalVisitorData  = visitorData.map((data) => _.pick(data, ['timestamp', 'uniq_vis']));
    let filledVisitorData = dataUtils.buildContiguousTimeline(
      finalVisitorData, optionsFinal.start, optionsFinal.end, optionsFinal.granularity, 'uniq_vis'
    );

    res.jsend(filledVisitorData);

  }).catch(() => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });
}

module.exports = routeVisitorsTime;
