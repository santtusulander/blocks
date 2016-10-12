'use strict';

let db        = require('../db');
let log       = require('../logger');
let validator = require('../validator');

/**
 * Return a list of SP accounts, groups, or assets that have served traffic for
 * a CP account, group, or property. Filter the data by time, net type,
 * and/or service type.
 */
function routeSPsWithTrafficForCP(req, res) {
  log.info('Getting sps-with-traffic-for-cp');
  log.debug('query params:', req.query);

  let params = req.query;

  // NOTE: The entity is modified before it gets passed to the query.
  // It is changed to match the proper db column names.
  let entityFinal = params.entity;

  let errors = validator.validate(params, {
    start         : {required: true, type: 'Timestamp'},
    end           : {required: false, type: 'Timestamp'},
    account       : {required: true, type: 'ID'},
    group         : {required: false, type: 'ID'},
    property      : {required: false, type: 'Property'},
    sp_account    : {required: false, type: 'ID'},
    sp_group      : {required: false, type: 'ID'},
    asset         : {required: false, type: 'Property'},
    net_type      : {required: false, type: 'Net_Type'},
    service_type  : {required: false, type: 'Service'},
    entity        : {required: true, type: 'SP_Entity'}
  });

  // Extra custom parameter validation
  if (!errors) {
    let customErrors = [];

    switch (params.entity) {
      case 'accounts':
        params.sp_account && customErrors.push(`Error: you can't provide an sp_account parameter when requesting a list of SP accounts.`);
        params.sp_group && customErrors.push(`Error: you can't provide an sp_group parameter when requesting a list of SP accounts.`);
        params.asset && customErrors.push(`Error: you can't provide an asset parameter when requesting a list of SP accounts.`);
        entityFinal = 'sp_account_id';
        break;

      case 'groups':
        !params.sp_account && customErrors.push(`Error: you must provide an sp_account parameter in order to get a list of SP groups.`);
        params.sp_group && customErrors.push(`Error: you can't provide an sp_group parameter when requesting a list of SP groups.`);
        params.asset && customErrors.push(`Error: you can't provide an asset parameter when requesting a list of SP groups.`);
        entityFinal = 'sp_group_id';
        break;

      case 'assets':
        !params.sp_account && customErrors.push(`Error: you must provide an sp_account parameter in order to get a list of SP assets.`);
        !params.sp_group && customErrors.push(`Error: you must provide an sp_group parameter in order to get a list of SP assets.`);
        params.asset && customErrors.push(`Error: you can't provide an asset parameter when requesting a list of SP assets.`);
        entityFinal = 'sp_asset';
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

module.exports = routeSPsWithTrafficForCP;
