'use strict';

let Promise = require('bluebird');
let db      = require('./db');
let log     = require('./logger');

describe("_executeQuery", function() {
  beforeEach(function() {
    spyOn(db.pool, 'query').and.stub();
    spyOn(log, 'debug').and.stub();
    db._executeQuery('SELECT * FROM ??', ['property_global_hour']);
  });

  it("should inject data into the supplied query", function() {
    expect(db.pool.query.calls.argsFor(0)[0]).toEqual('SELECT * FROM `property_global_hour`');
  });

  it("should call db.pool.query", function() {
    expect(db.pool.query.calls.any()).toBe(true);
  });
});


describe("_getQueryOptions", function() {
  it("should return an object containing the start date that was provided", function() {
    let finalOptions = db._getQueryOptions({start: 123});
    expect(finalOptions.start).toEqual(123);
  });

  it("should return an object containing the default value for the start date", function() {
    let finalOptions = db._getQueryOptions({});
    expect(finalOptions.start).toEqual(null);
  });

  it("should return an options object, even if an object was not passed in", function() {
    let finalOptions = db._getQueryOptions();
    expect(finalOptions.start).toEqual(null);
  });

});


describe("_getPropertyTraffic", function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getPropertyTraffic(options);
  });

  it("should call _getQueryOptions with the options object passed to _getPropertyTraffic", function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it("should call _executeQuery with the options object values passed in an array as the second argument", function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
    expect(optionsArray[3]).toBe(options.group);
  });
});


describe("_getPropertyCacheHitRate", function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getPropertyCacheHitRate(options);
  });

  it("should call _getQueryOptions with the options object passed to _getPropertyCacheHitRate", function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it("should call _executeQuery with the options object values passed in an array as the second argument", function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
    expect(optionsArray[3]).toBe(options.group);
  });
});


describe("_getPropertyTransferRates", function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  beforeEach(function() {
    spyOn(db, '_getQueryOptions').and.callThrough();
    spyOn(db, '_executeQuery').and.stub();
    db._getPropertyTransferRates(options);
  });

  it("should call _getQueryOptions with the options object passed to _getPropertyTransferRates", function() {
    let finalOptions = db._getQueryOptions.calls.argsFor(0)[0];
    expect(db._getQueryOptions.calls.any()).toBe(true);
    expect(finalOptions).toEqual(options);
  });

  it("should call _executeQuery with the options object values passed in an array as the second argument", function() {
    let optionsArray = db._executeQuery.calls.argsFor(0)[1];
    expect(db._executeQuery.calls.any()).toBe(true);
    expect(optionsArray[0]).toBe(options.start);
    expect(optionsArray[1]).toBe(options.end);
    expect(optionsArray[2]).toBe(options.account);
    expect(optionsArray[3]).toBe(options.group);
  });
});

describe("getPropertyMetrics", function() {
  let options = {start: 0, end: 1, account: 2, group: 3};
  let returnValue;
  beforeEach(function() {
    spyOn(db, '_getPropertyTraffic').and.returnValue(Promise.resolve(0));
    spyOn(db, '_getPropertyCacheHitRate').and.returnValue(Promise.resolve(1));
    spyOn(db, '_getPropertyTransferRates').and.returnValue(Promise.resolve(2));
    spyOn(log, 'debug').and.stub();
    spyOn(log, 'error').and.stub();
  });

  it("should call _getPropertyTraffic, _getPropertyCacheHitRate, and _getPropertyTransferRates with the options object passed to getPropertyMetrics", function() {
    returnValue = db.getPropertyMetrics(options);
    expect(db._getPropertyTraffic.calls.any()).toBe(true);
    expect(db._getPropertyTraffic.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getPropertyCacheHitRate.calls.any()).toBe(true);
    expect(db._getPropertyCacheHitRate.calls.argsFor(0)[0]).toEqual(options);
    expect(db._getPropertyTransferRates.calls.any()).toBe(true);
    expect(db._getPropertyTransferRates.calls.argsFor(0)[0]).toEqual(options);
  });

  it("should return a promise", function() {
    returnValue = db.getPropertyMetrics(options);
    expect(returnValue instanceof Promise).toBe(true);
  });

  it("should log the result of the queries", function(done) {
    // db._getPropertyTransferRates.and.returnValue(Promise.reject(new Error()));
    returnValue = db.getPropertyMetrics(options);
    returnValue.then(function() {
      expect(log.debug.calls.any()).toBe(true);
      expect(log.debug.calls.argsFor(0)[0][0]).toEqual(0);
      expect(log.debug.calls.argsFor(0)[0][1]).toEqual(1);
      expect(log.debug.calls.argsFor(0)[0][2]).toEqual(2);
      done();
    });
  });

  it("should log an error if one of the queries failed", function(done) {
    let error = new Error('error');
    db._getPropertyTransferRates.and.returnValue(Promise.reject(error));
    returnValue = db.getPropertyMetrics(options);
    returnValue.finally(function() {
      expect(log.error.calls.any()).toBe(true);
      expect(log.error.calls.argsFor(0)[0]).toEqual(error);
      done();
    });
  });


});
