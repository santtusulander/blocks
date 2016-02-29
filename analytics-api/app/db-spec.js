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


describe('db._getPropertyCacheHitRate', function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getPropertyCacheHitRate(options);
  });

  it('should call _getQueryOptions with the options object passed to _getPropertyCacheHitRate', function() {
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


describe('db._getGroupCacheHitRate', function() {
  let options = {start: 0, end: 1, account: 2};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getGroupCacheHitRate(options);
  });

  it('should call _getQueryOptions with the options object passed to _getGroupCacheHitRate', function() {
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
    spyOn(db, '_getPropertyCacheHitRate').and.returnValue(Promise.resolve(1));
    spyOn(db, '_getPropertyTransferRates').and.returnValue(Promise.resolve(2));
    spyOn(db, '_getGroupTraffic').and.returnValue(Promise.resolve(0));
    spyOn(db, '_getGroupCacheHitRate').and.returnValue(Promise.resolve(1));
    spyOn(db, '_getGroupTransferRates').and.returnValue(Promise.resolve(2));
    spyOn(log, 'info').and.stub();
    spyOn(log, 'error').and.stub();
  });

  it('should call _getPropertyTraffic, _getPropertyCacheHitRate, and _getPropertyTransferRates with the options object passed to getMetrics', function() {
    db.getMetrics(options);
    expect(db._getPropertyTraffic.calls.any()).toBe(true);
    expect(db._getPropertyTraffic.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getPropertyCacheHitRate.calls.any()).toBe(true);
    expect(db._getPropertyCacheHitRate.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getPropertyTransferRates.calls.any()).toBe(true);
    expect(db._getPropertyTransferRates.calls.argsFor(0)[0]).toEqual(options);
  });

  it('should call _getGroupTraffic, _getGroupCacheHitRate, and _getGroupTransferRates with the options object passed to getMetrics', function() {
    let options = {start: 0, end: 1, account: 2};
    db.getMetrics(options);
    expect(db._getGroupTraffic.calls.any()).toBe(true);
    expect(db._getGroupTraffic.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getGroupCacheHitRate.calls.any()).toBe(true);
    expect(db._getGroupCacheHitRate.calls.argsFor(0)[0]).toEqual(options);
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
