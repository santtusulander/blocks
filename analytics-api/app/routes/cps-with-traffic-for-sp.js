'use strict';

let db        = require('../db');
let log       = require('../logger');
let validator = require('../validator');

/**
 * Return a list of CP accounts, groups, or properties that have had traffic
 * served by an SP account, group, or asset. Filter the data by time, net type,
 * and/or service type.
 */
function routeCPsWithTrafficForSP(req, res) {
  log.info('Getting cps-with-traffic-for-sp');
  log.debug('query params:', req.query);

  let params = req.query;

  // NOTE: The entity is modified before it gets passed to the query.
  // It is changed to match the proper db column names.
  let entityFinal = params.entity;

  let errors = validator.validate(params, {
    start         : {required: true, type: 'Timestamp'},
    end           : {required: false, type: 'Timestamp'},
    account       : {required: false, type: 'ID'},
    group         : {required: false, type: 'ID'},
    property      : {required: false, type: 'Property'},
    sp_account    : {required: true, type: 'ID'},
    sp_group      : {required: false, type: 'ID'},
    asset         : {required: false, type: 'Property'},
    net_type      : {required: false, type: 'Net_Type'},
    service_type  : {required: false, type: 'Service'},
    entity        : {required: true, type: 'CP_Entity'}
  });

  // Extra custom parameter validation
  if (!errors) {
    let customErrors = [];

    switch (params.entity) {
      case 'accounts':
        params.account && customErrors.push(`Error: you can't provide an account parameter when requesting a list of CP accounts.`);
        params.group && customErrors.push(`Error: you can't provide a group parameter when requesting a list of CP accounts.`);
        params.property && customErrors.push(`Error: you can't provide a property parameter when requesting a list of CP accounts.`);
        entityFinal = 'account_id';
        break;

      case 'groups':
        !params.account && customErrors.push(`Error: you must provide an account parameter in order to get a list of CP groups.`);
        params.group && customErrors.push(`Error: you can't provide a group parameter when requesting a list of CP groups.`);
        params.property && customErrors.push(`Error: you can't provide a property parameter when requesting a list of CP groups.`);
        entityFinal = 'group_id';
        break;

      case 'properties':
        !params.account && customErrors.push(`Error: you must provide an account parameter in order to get a list of CP properties.`);
        !params.group && customErrors.push(`Error: you must provide a group parameter in order to get a list of CP properties.`);
        params.property && customErrors.push(`Error: you can't provide a property parameter when requesting a list of CP properties.`);
        entityFinal = 'property';
        break;
    }

    if (customErrors.length) {
      errors = customErrors;
    }
  }

  if (errors) {
    return res.status(400).jerror('Bad Request Parameters', errors);
  }

  let options = {
    start         : params.start,
    end           : params.end,
    account       : params.account,
    group         : params.group,
    property      : params.property,
    sp_account    : params.sp_account,
    sp_group      : params.sp_group,
    asset         : params.asset,
    net_type      : params.net_type,
    service_type  : params.service_type,
    entity        : entityFinal
  };

  let optionsFinal = db._getQueryOptions(options);

  db.getEntitiesWithTrafficForEntities(optionsFinal).then((entities) => {
    res.jsend(entities.map(entity => entity[entityFinal]));
  }).catch((err) => {
    log.error(err);
    res.status(500).jerror('Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = routeCPsWithTrafficForSP;
