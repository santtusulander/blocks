'use strict';
let _         = require('lodash');
let log       = require('./logger');
let validator = require('./validator');


describe('validator.validate', function() {
  beforeEach(function() {
    spyOn(log, 'debug').and.stub();
  });
  it('should return an array of error messages for invalid parameters', function() {
    spyOn(_, 'forOwn').and.callThrough();
    spyOn(validator, '_validateValue').and.returnValue('error message');
    let params = {start: 1451606400000};
    let spec = {
      start: {required: true, type: 'Timestamp'}
    };
    let result = validator.validate(params, spec);
    let _validateValueArgs = validator._validateValue.calls.argsFor(0);
    expect(_.forOwn.calls.count()).toBe(1);
    expect(validator._validateValue.calls.count()).toBe(1);
    expect(_validateValueArgs[0]).toBe('Timestamp');
    expect(_validateValueArgs[1].key).toBe('start');
    expect(_validateValueArgs[1].value).toBe(params.start);
    expect(_validateValueArgs[1].required).toBe(spec.start.required);
    expect(_.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
  });

  it('should return null if all parameters are valid', function() {
    spyOn(validator, '_validateValue').and.returnValue(null);
    let params = {start: 1451606400};
    let spec = {
      start: {required: true, type: 'Timestamp'}
    };
    let result = validator.validate(params, spec);
    expect(result).toBe(null);
  });
});

describe('The timestamp validator', function() {
  it('should return null for a valid timestamp', function() {
    let data = {
      key: 'start',
      value: 1451606400,
      required: true
    };
    let result = validator._validateValue('Timestamp', data);
    expect(result).toBe(null);
  });

  it('should return null for a parameter that was not provided and is not required', function() {
    let data = {
      key: 'start',
      required: false
    };
    let result = validator._validateValue('Timestamp', data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid timestamp', function() {
    let data = {
      key: 'start',
      value: 1451606400000,
      required: true
    };
    let result = validator._validateValue('Timestamp', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid timestamp, even if the parameter is not required', function() {
    let data = {
      key: 'start',
      value: 1451606400000,
      required: false
    };
    let result = validator._validateValue('Timestamp', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});


describe('The ID validator', function() {
  it('should return null for a valid ID', function() {
    let data = {
      key: 'account',
      value: 3,
      required: true
    };
    let result = validator._validateValue('ID', data);
    expect(result).toBe(null);
  });

  it('should return null for a parameter that was not provided and is not required', function() {
    let data = {
      key: 'group',
      required: false
    };
    let result = validator._validateValue('ID', data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid ID', function() {
    let data = {
      key: 'account',
      value: '1a',
      required: true
    };
    let result = validator._validateValue('ID', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid ID, even if the parameter is not required', function() {
    let data = {
      key: 'group',
      value: '1a',
      required: false
    };
    let result = validator._validateValue('ID', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});


describe('The property validator', function() {
  it('should return null for a valid property', function() {
    let data = {
      key: 'property',
      value: 'idean.com',
      required: true
    };
    let result = validator._validateValue('Property', data);
    expect(result).toBe(null);
  });

  it('should return null for a parameter that was not provided and is not required', function() {
    let data = {
      key: 'property',
      required: false
    };
    let result = validator._validateValue('Property', data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid property', function() {
    let data = {
      key: 'property',
      value: '',
      required: true
    };
    let result = validator._validateValue('Property', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid property, even if the parameter is not required', function() {
    let data = {
      key: 'property',
      value: '',
      required: false
    };
    let result = validator._validateValue('Property', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});


describe('The service validator', function() {
  it('should return null for a valid service type', function() {
    let data = {
      key: 'service_type',
      value: 'http',
      required: true
    };
    let result = validator._validateValue('Service', data);
    expect(result).toBe(null);
  });

  it('should return null for a parameter that was not provided and is not required', function() {
    let data = {
      key: 'service_type',
      required: false
    };
    let result = validator._validateValue('Service', data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid service type', function() {
    let data = {
      key: 'service_type',
      value: 'ftp',
      required: true
    };
    let result = validator._validateValue('Service', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid service type, even if the parameter is not required', function() {
    let data = {
      key: 'service_type',
      value: 'ftp',
      required: false
    };
    let result = validator._validateValue('Service', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});


describe('The granularity validator', function() {
  it('should return null for a valid granularity', function() {
    let data = {
      key: 'granularity',
      value: 'hour',
      required: true
    };
    let result = validator._validateValue('Granularity', data);
    expect(result).toBe(null);
  });

  it('should return null for a parameter that was not provided and is not required', function() {
    let data = {
      key: 'granularity',
      required: false
    };
    let result = validator._validateValue('Granularity', data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid granularity', function() {
    let data = {
      key: 'granularity',
      value: 'year',
      required: true
    };
    let result = validator._validateValue('Granularity', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid granularity, even if the parameter is not required', function() {
    let data = {
      key: 'granularity',
      value: 'hourly',
      required: false
    };
    let result = validator._validateValue('Granularity', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});


describe('The number validator', function() {
  it('should return null for a valid number', function() {
    let data = {
      key: 'account',
      value: 3,
      required: true
    };
    let result = validator._validateValue('number', data);
    expect(result).toBe(null);
  });

  it('should return an error message for an invalid number', function() {
    let data = {
      key: 'account',
      value: '1a',
      required: true
    };
    let result = validator._validateValue('number', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });

  it('should return an error message for an invalid number, even if the parameter is not required', function() {
    let data = {
      key: 'group',
      value: '1a',
      required: false
    };
    let result = validator._validateValue('number', data);
    expect(typeof result).toBe('string');
    expect(result.indexOf('Error')).toBe(0);
  });
});
