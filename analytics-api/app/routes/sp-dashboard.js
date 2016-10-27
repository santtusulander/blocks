'use strict';

require('express-jsend');
// let _         = require('lodash');
let log       = require('../logger');
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

    res.jsend({globalData, countryData, providerData, finalData});

  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeSpDashboard;
