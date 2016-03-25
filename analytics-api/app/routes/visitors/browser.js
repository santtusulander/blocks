'use strict';

require('express-jsend');
let _         = require('lodash');
let dataUtils = require('../../data-utils');
let db        = require('../../db');
let log       = require('../../logger');
let validator = require('../../validator');
// let testData = require('./browser-data');

function routeVisitorsBrowser(req, res) {
  log.info('Getting visitors/browser');
  log.debug('query params:', req.query);

  let params = req.query;
  let errors = validator.validate(params, {
    start                 : {required: true, type: 'Timestamp'},
    end                   : {required: false, type: 'Timestamp'},
    account               : {required: true, type: 'ID'},
    group                 : {required: false, type: 'ID'},
    property              : {required: false, type: 'Property'},
    granularity           : {required: false, type: 'Granularity'},
    aggregate_granularity : {required: false, type: 'Granularity'},
    max_browsers          : {required: false, type: 'Number'}
  });

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start                 : params.start,
    end                   : params.end,
    account               : params.account,
    group                 : params.group,
    property              : params.property,
    granularity           : params.granularity,
    aggregate_granularity : params.aggregate_granularity,
    dimension             : 'browser'
  };

  db.getVisitorWithTotals(options).spread((visitorData, dimensionTotals, grandTotalData) => {
    let dimension              = 'browser';
    let optionsFinal           = db._getQueryOptions(options);
    let maxBrowsers            = params.max_browsers || 5;
    let dimensionTotalsGrouped = _.groupBy(dimensionTotals, dimension);
    let grandTotal             = grandTotalData[0].uniq_vis;
    let responseData = {
      total: grandTotal,
      browsers: dataUtils.processVisitorDataByDimension(
        dimension, visitorData, dimensionTotalsGrouped, grandTotal, maxBrowsers, optionsFinal
      )
    };

    res.jsend(responseData);

  }).catch(() => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });
}

module.exports = routeVisitorsBrowser;
