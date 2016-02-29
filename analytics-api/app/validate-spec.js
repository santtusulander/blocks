'use strict';
let _        = require('lodash');
let log      = require('./logger');
let validate = require('./validate');


describe('validate.params', function() {
  beforeEach(function() {
    spyOn(log, 'debug').and.stub();
  });
  it('should return an array of error messages for invalid parameters', function() {
    spyOn(_, 'forOwn').and.callThrough();
    spyOn(validate, '_validateTimestamp').and.returnValue('error message');
    let params = {start: 1451606400000};
    let spec = {
      start: {required: true, type: 'Timestamp'}
    };
    let result = validate.params(params, spec);
    let _validateTimestampArgs = validate._validateTimestamp.calls.argsFor(0)[0];
    expect(_.forOwn.calls.count()).toEqual(1);
    expect(validate._validateTimestamp.calls.count()).toEqual(1);
    expect(_validateTimestampArgs.key).toEqual('start');
    expect(_validateTimestampArgs.value).toEqual(params.start);
    expect(_validateTimestampArgs.required).toEqual(spec.start.required);
    expect(_.isArray(result)).toBe(true);
    expect(result.length).toEqual(1);
  });

  it('should return null if all parameters are valid', function() {
    spyOn(validate, '_validateTimestamp').and.returnValue(null);
    let params = {start: 1451606400};
    let spec = {
      start: {required: true, type: 'Timestamp'}
    };
    let result = validate.params(params, spec);
    expect(result).toBe(null);
  });
});


describe('validate._validateTimestamp', function() {
  it('should return null for a valid timestamp', function() {
    let data = {
      key: 'start',
      value: 1451606400,
      required: true
    };
    let result = validate._validateTimestamp(data);
    expect(result).toBe(null);
  });

  it('should return null for a parameter that was not provided and is not required', function() {
    let data = {
      key: 'start',
      required: false
    };
    let result = validate._validateTimestamp(data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid timestamp', function() {
    let data = {
      key: 'start',
      value: 1451606400000,
      required: true
    };
    let result = validate._validateTimestamp(data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid timestamp, even if the parameter is not required', function() {
    let data = {
      key: 'start',
      value: 1451606400000,
      required: false
    };
    let result = validate._validateTimestamp(data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});


describe('validate._validateID', function() {
  it('should return null for a valid ID', function() {
    let data = {
      key: 'account',
      value: 3,
      required: true
    };
    let result = validate._validateID(data);
    expect(result).toBe(null);
  });

  it('should return null for a parameter that was not provided and is not required', function() {
    let data = {
      key: 'group',
      required: false
    };
    let result = validate._validateID(data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid ID', function() {
    let data = {
      key: 'account',
      value: '1a',
      required: true
    };
    let result = validate._validateID(data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid ID, even if the parameter is not required', function() {
    let data = {
      key: 'group',
      value: '1a',
      required: false
    };
    let result = validate._validateID(data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});
