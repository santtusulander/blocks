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
    let dimensionTotalsGrouped = _.groupBy(dimensionTotals, 'browser');
    let grandTotal             = grandTotalData[0].uniq_vis;
    let optionsFinal           = db._getQueryOptions(options);
    let maxBrowsers            = params.max_browsers || 5;
    let allBrowserVisitorData  = _.groupBy(visitorData, 'browser');
    let responseData = {
      total: grandTotal,
      browsers: []
    };

    _.forOwn(allBrowserVisitorData, (browserData, browserName) => {
      let visitorRecords;
      let browserTotal = dimensionTotalsGrouped[browserName][0].uniq_vis;
      let browserRecord = {
        name: browserName,
        percent_total: parseFloat((browserTotal / grandTotal).toFixed(4)),
        total: browserTotal,
        detail: []
      };

      // Set the detail array on the browserRecord
      // Calculate total visitors for the browser
      // Remove the browser key from each record — since we're already
      // grouped by browser, we don't need to transfer all that extra data
      // over the network.
      visitorRecords = browserData.map((data) => {
        return _.pick(data, ['timestamp', 'uniq_vis']);
      });

      // Ensure there is a record for each time interval
      visitorRecords = dataUtils.buildContiguousTimeline(
        visitorRecords, optionsFinal.start, optionsFinal.end, optionsFinal.granularity, 'uniq_vis'
      );
      browserRecord.detail = visitorRecords;

      // Add the browserRecord to the response data
      responseData.browsers.push(browserRecord);

    });

    // Sort the browsers by their total in descending order
    responseData.browsers = _.sortBy(responseData.browsers, 'total').reverse();

    // Only include the number of browsers specified by maxBrowsers
    responseData.browsers = _.take(responseData.browsers, maxBrowsers);

    res.jsend(responseData);

  }).catch((err) => {
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });
}

module.exports = routeVisitorsBrowser;
