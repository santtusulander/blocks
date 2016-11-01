'use strict';

let Promise = require('bluebird');
let _       = require('lodash');
let db      = require('./db');
let log     = require('./logger');

describe('db._executeQuery', function() {
  beforeEach(function() {
    spyOn(db.pool, 'query').and.stub();
    spyOn(log, 'debug').and.stub();
    db._executeQuery('SELECT * FROM ??', ['property_global_hour']);
  });

  it('should inject data into the supplied query', function() {
    expect(db.pool.query.calls.argsFor(0)[0]).toEqual('SELECT * FROM `property_global_hour`');
  });

  it('should call db.pool.query', function() {
    expect(db.pool.query.calls.any()).toBe(true);
  });
});


describe('db._getQueryOptions', function() {
  it('should return an object containing the start date that was provided', function() {
    let finalOptions = db._getQueryOptions({start: 123});
    expect(finalOptions.start).toEqual(123);
  });

  it('should favor default values over undefined values', function() {
    let finalOptions = db._getQueryOptions({granularity: _.noop()});
    expect(_.isUndefined(_.noop())).toEqual(true);
    expect(finalOptions.granularity).toEqual('hour');
  });

  it('should return an object containing the default value for the start date', function() {
    let finalOptions = db._getQueryOptions({});
    expect(finalOptions.start).toEqual(null);
  });

  it('should return an options object, even if an object was not passed in', function() {
    let finalOptions = db._getQueryOptions();
    expect(finalOptions.start).toEqual(null);
  });

});


describe('db._getAccountLevel', function() {
  // isListingChildren is true
  it('should return "property" if account and group were provided, and isListingChildren is true', function() {
    let level = db._getAccountLevel({account: true, group: true}, true);
    expect(level).toBe('property');
  });

  it('should return "group" if account was provided, and isListingChildren is true', function() {
    let level = db._getAccountLevel({account: true}, true);
    expect(level).toBe('group');
  });

  it('should return "account" if account, group, and property were NOT provided, and isListingChildren is true', function() {
    let level = db._getAccountLevel({}, true);
    expect(level).toBe('account');
  });

  // isListingChildren is false
  it('should return "property" if account, group, and property were provided, and isListingChildren is false', function() {
    let level = db._getAccountLevel({account: true, group: true, property: true});
    expect(level).toBe('property');
  });

  it('should return "group" if account and group were provided, and isListingChildren is false', function() {
    let level = db._getAccountLevel({account: true, group: true});
    expect(level).toBe('group');
  });

  it('should return "account" if account was provided, and isListingChildren is false', function() {
    let level = db._getAccountLevel({account: true});
    expect(level).toBe('account');
  });

  it('should return null if the level could not be determined, and isListingChildren is false', function() {
    let level = db._getAccountLevel({});
    expect(level).toBe(null);
  });


});


describe('db._getAggregateNumbers', function() {
  let options = {start: 0, end: 1, account: 2, granularity: 'hour'};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
  });

  it('should call _getQueryOptions with the options object passed to _getAggregateNumbers', function() {
    db._getAggregateNumbers(options);
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it('should call _executeQuery with the options object values passed in an array as the second argument', function() {
    db._getAggregateNumbers(options);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe('account_global_hour');
    expect(optionsArray[1]).toBe(options.start);
    expect(optionsArray[2]).toBe(options.end);
    expect(optionsArray[3]).toBe(options.account);
    expect(optionsArray[4]).toBeUndefined();
  });

  it('should get numbers for child accounts when account, group, and property are NOT provided and isListingChildren is true', function() {
    db._getAggregateNumbers({start: 0, end: 1, granularity: 'hour'}, true);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    let query = db._executeQuery.calls.argsFor(0)[0];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(/account_id AS `account`,/.test(query)).toBe(true);
    expect(/AND account_id = \?/.test(query)).toBe(false);
    expect(/AND group_id = \?/.test(query)).toBe(false);
    expect(/AND property = \?/.test(query)).toBe(false);
    expect(/GROUP BY account_id/.test(query)).toBe(true);
    expect(optionsArray[0]).toBe('account_global_hour');
    expect(optionsArray[1]).toBe(options.start);
    expect(optionsArray[2]).toBe(options.end);
    expect(optionsArray[3]).toBeUndefined();
  });

  it('should get numbers for child groups of an account when account is provided and isListingChildren is true', function() {
    db._getAggregateNumbers(options, true);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    let query = db._executeQuery.calls.argsFor(0)[0];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(/group_id AS `group`,/.test(query)).toBe(true);
    expect(/AND account_id = \?/.test(query)).toBe(true);
    expect(/AND group_id = \?/.test(query)).toBe(false);
    expect(/AND property = \?/.test(query)).toBe(false);
    expect(/GROUP BY group_id/.test(query)).toBe(true);
    expect(optionsArray[0]).toBe('group_global_hour');
    expect(optionsArray[1]).toBe(options.start);
    expect(optionsArray[2]).toBe(options.end);
    expect(optionsArray[3]).toBe(options.account);
    expect(optionsArray[4]).toBeUndefined();
  });

  it('should get numbers for child properties of a group when account and group are provided and isListingChildren is true', function() {
    let optionsModified = Object.assign({}, options, {group: 3});
    db._getAggregateNumbers(optionsModified, true);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    let query = db._executeQuery.calls.argsFor(0)[0];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(/property,/.test(query)).toBe(true);
    expect(/AND account_id = \?/.test(query)).toBe(true);
    expect(/AND group_id = \?/.test(query)).toBe(true);
    expect(/AND property = \?/.test(query)).toBe(false);
    expect(/GROUP BY property/.test(query)).toBe(true);
    expect(optionsArray[0]).toBe('property_global_hour');
    expect(optionsArray[1]).toBe(optionsModified.start);
    expect(optionsArray[2]).toBe(optionsModified.end);
    expect(optionsArray[3]).toBe(optionsModified.account);
    expect(optionsArray[4]).toBe(optionsModified.group);
    expect(optionsArray[5]).toBeUndefined();
  });

  it('should get numbers for child properties of a group when account, group, and property are provided and isListingChildren is true', function() {
    let optionsModified = Object.assign({}, options, {group: 3, property: 4});
    db._getAggregateNumbers(optionsModified, true);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    let query = db._executeQuery.calls.argsFor(0)[0];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(/property,/.test(query)).toBe(true);
    expect(/AND account_id = \?/.test(query)).toBe(true);
    expect(/AND group_id = \?/.test(query)).toBe(true);
    expect(/AND property = \?/.test(query)).toBe(false);
    expect(/GROUP BY property/.test(query)).toBe(true);
    expect(optionsArray[0]).toBe('property_global_hour');
    expect(optionsArray[1]).toBe(optionsModified.start);
    expect(optionsArray[2]).toBe(optionsModified.end);
    expect(optionsArray[3]).toBe(optionsModified.account);
    expect(optionsArray[4]).toBe(optionsModified.group);
    expect(optionsArray[5]).toBeUndefined();
  });

  it('should get numbers for an account when an account is provided and isListingChildren is false', function() {
    db._getAggregateNumbers(options);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    let query = db._executeQuery.calls.argsFor(0)[0];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(/account_id AS `account`,/.test(query)).toBe(true);
    expect(/AND account_id = \?/.test(query)).toBe(true);
    expect(/AND group_id = \?/.test(query)).toBe(false);
    expect(/AND property = \?/.test(query)).toBe(false);
    expect(/GROUP BY account_id/.test(query)).toBe(true);
    expect(optionsArray[0]).toBe('account_global_hour');
    expect(optionsArray[1]).toBe(options.start);
    expect(optionsArray[2]).toBe(options.end);
    expect(optionsArray[3]).toBe(options.account);
    expect(optionsArray[4]).toBeUndefined();
  });

  it('should get numbers for a group when an account and group are provided and isListingChildren is false', function() {
    let optionsModified = Object.assign({}, options, {group: 3});
    db._getAggregateNumbers(optionsModified);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    let query = db._executeQuery.calls.argsFor(0)[0];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(/group_id AS `group`,/.test(query)).toBe(true);
    expect(/AND account_id = \?/.test(query)).toBe(true);
    expect(/AND group_id = \?/.test(query)).toBe(true);
    expect(/AND property = \?/.test(query)).toBe(false);
    expect(/GROUP BY group_id/.test(query)).toBe(true);
    expect(optionsArray[0]).toBe('group_global_hour');
    expect(optionsArray[1]).toBe(optionsModified.start);
    expect(optionsArray[2]).toBe(optionsModified.end);
    expect(optionsArray[3]).toBe(optionsModified.account);
    expect(optionsArray[4]).toBe(optionsModified.group);
    expect(optionsArray[5]).toBeUndefined();
  });

  it('should get numbers for a property when an account, group, and property are provided and isListingChildren is false', function() {
    let optionsModified = Object.assign({}, options, {group: 3, property: 4});
    db._getAggregateNumbers(optionsModified);
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    let query = db._executeQuery.calls.argsFor(0)[0];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(/property,/.test(query)).toBe(true);
    expect(/AND account_id = \?/.test(query)).toBe(true);
    expect(/AND group_id = \?/.test(query)).toBe(true);
    expect(/AND property = \?/.test(query)).toBe(true);
    expect(/GROUP BY property/.test(query)).toBe(true);
    expect(optionsArray[0]).toBe('property_global_hour');
    expect(optionsArray[1]).toBe(optionsModified.start);
    expect(optionsArray[2]).toBe(optionsModified.end);
    expect(optionsArray[3]).toBe(optionsModified.account);
    expect(optionsArray[4]).toBe(optionsModified.group);
    expect(optionsArray[5]).toBe(optionsModified.property);
    expect(optionsArray[6]).toBeUndefined();
  });
});


describe('db.getMetrics', function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getAggregateNumbers').and.returnValue(Promise.resolve(1));
    spyOn(db, 'getEgressWithHistorical').and.returnValue(Promise.resolve(0));
    spyOn(log, 'info').and.stub();
    spyOn(log, 'error').and.stub();
  });

  it('should call getEgressWithHistorical and _getAggregateNumbers with the options object passed to getMetrics', function() {
    db.getMetrics(options);
    expect(db.getEgressWithHistorical.calls.any()).toBe(true);
    expect(db.getEgressWithHistorical.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getAggregateNumbers.calls.any()).toBe(true);
    expect(db._getAggregateNumbers.calls.argsFor(0)[0]).toEqual(options);
  });

  it('should call getEgressWithHistorical and _getAggregateNumbers with the options object passed to getMetrics', function() {
    let options = {start: 0, end: 1, account: 2};
    db.getMetrics(options);
    expect(db.getEgressWithHistorical.calls.any()).toBe(true);
    expect(db.getEgressWithHistorical.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getAggregateNumbers.calls.any()).toBe(true);
    expect(db._getAggregateNumbers.calls.argsFor(0)[0]).toEqual(options);
  });

  it('should return a promise', function() {
    let getMetricsPromise = db.getMetrics(options);
    expect(getMetricsPromise instanceof Promise).toBe(true);
  });

  it('should log the number of result sets received from the queries', function(done) {
    db.getMetrics(options).then(function(data) {
      var logCalls   = log.info.calls;
      var lastLogMessage = logCalls.argsFor(logCalls.count() - 1)[0];
      expect(logCalls.any()).toBe(true);
      expect(parseInt(lastLogMessage.match(/\d+/)[0])).toEqual(data.length);
      done();
    });
  });

  it('should log an error if one of the queries failed', function(done) {
    let error = new Error('error');
    db._getAggregateNumbers.and.returnValue(Promise.reject(error));
    db.getMetrics(options).finally(function() {
      expect(log.error.calls.any()).toBe(true);
      expect(log.error.calls.argsFor(0)[0]).toEqual(error);
      done();
    });
  });

});


describe('db.getEgressTotal', function() {
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
  });

  it('should return daily and monthly numbers for properties', function() {
    // Get day egress
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3,
      property: 'idean.com'
    };
    db.getEgressTotal(options);

    // Get month egress
    options.end = 1454284799;
    db.getEgressTotal(options);

    expect(db._getQueryOptions.calls.any()).toBe(true);

    // Check day
    let queryParams = db._executeQuery.calls.argsFor(0)[1];
    expect(queryParams[0]).toBe('property_global_day');

    // Check month
    let finalOptions = db._getQueryOptions.calls.argsFor(1)[0];
    queryParams = db._executeQuery.calls.argsFor(1)[1];
    expect(finalOptions).toEqual(options);
    expect(queryParams[0]).toBe('property_global_month');
  });

  it('should return daily and monthly numbers for groups', function() {
    // Get day egress
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3
    };
    db.getEgressTotal(options);

    // Get month egress
    options.end = 1454284799;
    db.getEgressTotal(options);

    expect(db._getQueryOptions.calls.any()).toBe(true);

    // Check day
    let queryParams = db._executeQuery.calls.argsFor(0)[1];
    expect(queryParams[0]).toBe('group_global_day');

    // Check month
    let finalOptions = db._getQueryOptions.calls.argsFor(1)[0];
    queryParams = db._executeQuery.calls.argsFor(1)[1];
    expect(finalOptions).toEqual(options);
    expect(queryParams[0]).toBe('group_global_month');
  });

  it('should return daily and monthly numbers for accounts', function() {
    // Get day egress
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3
    };
    db.getEgressTotal(options);

    // Get month egress
    options.end = 1454284799;
    db.getEgressTotal(options);

    expect(db._getQueryOptions.calls.any()).toBe(true);

    // Check day
    let queryParams = db._executeQuery.calls.argsFor(0)[1];
    expect(queryParams[0]).toBe('account_global_day');

    // Check month
    let finalOptions = db._getQueryOptions.calls.argsFor(1)[0];
    queryParams = db._executeQuery.calls.argsFor(1)[1];
    expect(finalOptions).toEqual(options);
    expect(queryParams[0]).toBe('account_global_month');
  });

  it('should return daily numbers for properties by default', function() {
    // Get day egress
    let options = {
      start: 0,
      end: 1
    };
    db.getEgressTotal(options);

    // Check day
    let queryParams = db._executeQuery.calls.argsFor(0)[1];
    expect(queryParams[0]).toBe('property_global_day');

  });
});


describe('db.getEgress', function() {
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_getAccountLevel').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
  });

  it('should return hourly data for a property', function() {
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3,
      property: 'idean.com'
    };

    db.getEgress(options);

    let queryParams = db._executeQuery.calls.argsFor(0)[1];
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(db._getAccountLevel.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
    expect(queryParams[0]).toBe('property_global_hour');
  });

  it('should select the country field if the dimension option was passed as country', function() {
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3,
      property: 'idean.com',
      dimension: 'country'
    };

    db.getEgress(options);

    let query = db._executeQuery.calls.argsFor(0)[0];
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(finalOptions).toEqual(options);
    expect(/country,/.test(query)).toBe(true);
  });

  it('should include service_type in the WHERE clause if the service_type option was passed', function() {
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3,
      property: 'idean.com',
      service_type: 'http'
    };

    db.getEgress(options);

    let query = db._executeQuery.calls.argsFor(0)[0];
    let queryParams = db._executeQuery.calls.argsFor(0)[1];
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(finalOptions).toEqual(options);
    expect(queryParams[queryParams.length - 1]).toBe('http');
    expect(/service_type = \?/.test(query)).toBe(true);
  });

});


describe('db.getEgressWithHistorical', function() {
  let options = {start: 10, end: 19, account: 2, group: 3};
  let optionsHistoric = {start: 0, end: 9, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_getAccountLevel').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    spyOn(db, 'getEgress').and.returnValue(Promise.resolve(0));
    spyOn(log, 'info').and.stub();
    spyOn(log, 'error').and.stub();
  });

  it('should call getEgress twice, once for the requested time range, and once for the previous time range of the same duration', function() {
    db.getEgressWithHistorical(options);
    let optionsFinal = db.getEgress.calls.argsFor(0)[0];
    let optionsFinalHistoric = db.getEgress.calls.argsFor(1)[0];
    expect(db.getEgress.calls.count()).toBe(2);
    expect(optionsFinal.start).toBe(options.start);
    expect(optionsFinal.end).toBe(options.end);
    expect(optionsFinalHistoric.start).toBe(optionsHistoric.start);
    expect(optionsFinalHistoric.end).toBe(optionsHistoric.end);
  });

  it('should return a promise', function() {
    let getEgressWithHistoricalPromise = db.getEgressWithHistorical(options);
    expect(getEgressWithHistoricalPromise instanceof Promise).toBe(true);
  });

  it('should log the number of result sets received from the queries', function(done) {
    db.getEgressWithHistorical(options).then(function(data) {
      expect(log.info.calls.any()).toBe(true);
      expect(parseInt(log.info.calls.argsFor(0)[0].match(/\d+/)[0])).toEqual(data.length);
      done();
    });
  });

  it('should log an error if one of the queries failed', function(done) {
    let error = new Error('error');
    db.getEgress.and.returnValue(Promise.reject(error));
    db.getEgressWithHistorical(options).finally(function() {
      expect(log.error.calls.any()).toBe(true);
      expect(log.error.calls.argsFor(0)[0]).toEqual(error);
      done();
    });
  });

});


describe('db.getVisitors', function() {
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_getAccountLevel').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
  });

  it('should return hourly data for a property', function() {
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3,
      property: 'idean.com'
    };

    db.getVisitors(options);

    let queryParams = db._executeQuery.calls.argsFor(0)[1];
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(db._getAccountLevel.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
    expect(queryParams[0]).toBe('property_global_hour');
  });

  it('should select the country field if the dimension option was passed as country', function() {
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3,
      property: 'idean.com',
      dimension: 'country'
    };

    db.getVisitors(options);

    let query = db._executeQuery.calls.argsFor(0)[0];
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(finalOptions).toEqual(options);
    expect(/country,/.test(query)).toBe(true);
  });

  it('should not sum uniq_vis on non-traffic tables', function() {
    let options = {
      start: 1451606400,
      end: 1451692799,
      account: 3,
      group: 3,
      property: 'idean.com',
      dimension: 'browser'
    };

    db.getVisitors(options);

    let query = db._executeQuery.calls.argsFor(0)[0];
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(finalOptions).toEqual(options);
    expect(/sum\(uniq_vis\) AS uniq_vis/.test(query)).toBe(false);
    expect(/uniq_vis/.test(query)).toBe(true);
  });

});


describe('db.getVisitorWithTotals', function() {
  let options = {
    start: 1451606400,
    end: 1451692799,
    account: 3,
    group: 3,
    property: 'idean.com',
    granularity: 'hour',
    aggregate_granularity: 'month',
    dimension: 'country'
  };

  beforeEach(function() {
    spyOn(db, 'getVisitors').and.returnValue(Promise.resolve(0));
    spyOn(log, 'info').and.stub();
    spyOn(log, 'error').and.stub();
  });

  it('should call getVisitors three times with the correct options if dimension is country', function() {
    db.getVisitorWithTotals(options);

    let getVisitorsDetailOptions    = db.getVisitors.calls.argsFor(0)[0];
    let getVisitorsDimensionOptions = db.getVisitors.calls.argsFor(1)[0];
    let getVisitorsTotalOptions     = db.getVisitors.calls.argsFor(2)[0];

    expect(db.getVisitors.calls.count()).toBe(3);
    expect(getVisitorsDetailOptions).toEqual(options);
    expect(getVisitorsDimensionOptions.granularity).toBe(options.aggregate_granularity);
    expect(getVisitorsTotalOptions.granularity).toBe(options.aggregate_granularity);
    expect(getVisitorsTotalOptions.dimension).toBe('global');
  });

  it('should call getVisitors twice with the correct options if dimension is NOT country', function() {
    db.getVisitorWithTotals(Object.assign({}, options, {dimension: 'os'}));
    expect(db.getVisitors.calls.count()).toBe(2);
  });

  it('should return a promise', function() {
    let getVisitorWithTotalsPromise = db.getVisitorWithTotals(options);
    expect(getVisitorWithTotalsPromise instanceof Promise).toBe(true);
  });

  it('should log the number of result sets received from the queries', function(done) {
    db.getVisitorWithTotals(options).then(function(data) {
      expect(log.info.calls.any()).toBe(true);
      expect(parseInt(log.info.calls.argsFor(0)[0].match(/\d+/)[0])).toEqual(data.length);
      done();
    });
  });

  it('should log an error if one of the queries failed', function(done) {
    let error = new Error('error');
    db.getVisitors.and.returnValue(Promise.reject(error));
    db.getVisitorWithTotals(options).finally(function() {
      expect(log.error.calls.any()).toBe(true);
      expect(log.error.calls.argsFor(0)[0]).toEqual(error);
      done();
    });
  });

});
