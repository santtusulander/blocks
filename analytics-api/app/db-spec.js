'use strict';

let Promise = require('bluebird');
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


describe('db._getPropertyTraffic', function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getPropertyTraffic(options);
  });

  it('should call _getQueryOptions with the options object passed to _getPropertyTraffic', function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it('should call _executeQuery with the options object values passed in an array as the second argument', function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
    expect(optionsArray[3]).toBe(options.group);
  });
});


describe('db._getGroupTraffic', function() {
  let options = {start: 0, end: 1, account: 2};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getGroupTraffic(options);
  });

  it('should call _getQueryOptions with the options object passed to _getGroupTraffic', function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it('should call _executeQuery with the options object values passed in an array as the second argument', function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
  });
});


describe('db._getPropertyAggregateNumbers', function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getPropertyAggregateNumbers(options);
  });

  it('should call _getQueryOptions with the options object passed to _getPropertyAggregateNumbers', function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it('should call _executeQuery with the options object values passed in an array as the second argument', function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
    expect(optionsArray[3]).toBe(options.group);
  });
});


describe('db._getGroupAggregateNumbers', function() {
  let options = {start: 0, end: 1, account: 2};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getGroupAggregateNumbers(options);
  });

  it('should call _getQueryOptions with the options object passed to _getGroupAggregateNumbers', function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it('should call _executeQuery with the options object values passed in an array as the second argument', function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
  });
});


describe('db._getPropertyTransferRates', function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getPropertyTransferRates(options);
  });

  it('should call _getQueryOptions with the options object passed to _getPropertyTransferRates', function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it('should call _executeQuery with the options object values passed in an array as the second argument', function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
    expect(optionsArray[3]).toBe(options.group);
  });
});


describe('db._getGroupTransferRates', function() {
  let options = {start: 0, end: 1, account: 2};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getGroupTransferRates(options);
  });

  it('should call _getQueryOptions with the options object passed to _getGroupTransferRates', function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it('should call _executeQuery with the options object values passed in an array as the second argument', function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
  });
});


describe('db.getMetrics', function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getPropertyTraffic').and.returnValue(Promise.resolve(0));
    spyOn(db, '_getPropertyAggregateNumbers').and.returnValue(Promise.resolve(1));
    spyOn(db, '_getPropertyTransferRates').and.returnValue(Promise.resolve(2));
    spyOn(db, '_getGroupTraffic').and.returnValue(Promise.resolve(0));
    spyOn(db, '_getGroupAggregateNumbers').and.returnValue(Promise.resolve(1));
    spyOn(db, '_getGroupTransferRates').and.returnValue(Promise.resolve(2));
    spyOn(log, 'info').and.stub();
    spyOn(log, 'error').and.stub();
  });

  it('should call _getPropertyTraffic, _getPropertyAggregateNumbers, and _getPropertyTransferRates with the options object passed to getMetrics', function() {
    db.getMetrics(options);
    expect(db._getPropertyTraffic.calls.any()).toBe(true);
    expect(db._getPropertyTraffic.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getPropertyAggregateNumbers.calls.any()).toBe(true);
    expect(db._getPropertyAggregateNumbers.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getPropertyTransferRates.calls.any()).toBe(true);
    expect(db._getPropertyTransferRates.calls.argsFor(0)[0]).toEqual(options);
  });

  it('should call _getGroupTraffic, _getGroupAggregateNumbers, and _getGroupTransferRates with the options object passed to getMetrics', function() {
    let options = {start: 0, end: 1, account: 2};
    db.getMetrics(options);
    expect(db._getGroupTraffic.calls.any()).toBe(true);
    expect(db._getGroupTraffic.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getGroupAggregateNumbers.calls.any()).toBe(true);
    expect(db._getGroupAggregateNumbers.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getGroupTransferRates.calls.any()).toBe(true);
    expect(db._getGroupTransferRates.calls.argsFor(0)[0]).toEqual(options);
  });

  it('should return a promise', function() {
    let getMetricsPromise = db.getMetrics(options);
    expect(getMetricsPromise instanceof Promise).toBe(true);
  });

  it('should log the number of result sets received from the queries', function(done) {
    db.getMetrics(options).then(function(data) {
      expect(log.info.calls.any()).toBe(true);
      expect(parseInt(log.info.calls.argsFor(0)[0].match(/\d+/)[0])).toEqual(data.length);
      done();
    });
  });

  it('should log an error if one of the queries failed', function(done) {
    let error = new Error('error');
    db._getPropertyTransferRates.and.returnValue(Promise.reject(error));
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

  it('should return daily and monthly numbers for groups', function() {
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
