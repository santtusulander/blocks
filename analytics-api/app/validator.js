'use strict';
let _   = require('lodash');
let log = require('./logger');


/**
 * A validation utility for custom types.
 * NOTE: This file exports an instance of this class, effectively making it a singleton.
 * @class
 */
class Validator {

  /**
   * Sets up custom validation types. Each type has an error message function
   * and a validator regex used to determine if a value is valid.
   * @constructor
   */
  constructor() {
    this._types = {
      timestamp: {
        validator : /^\d{10}$/,
        message   : (key, value) => `Error with ${key} parameter: You must provide a valid date (seconds elapsed since UNIX epoch). Value received: ${value}`
      },
      id: {
        validator : /^\d+$/,
        message   : (key, value) => `Error with ${key} parameter: You must provide a valid ID (number). Value received: ${value}`
      },
      property: {
        validator : /^.+$/,
        message   : (key, value) => `Error with ${key} parameter: You must provide a valid string. Value received: ${value}`
      },
      service: {
        validator : /^https?$/,
        message   : (key, value) => `Error with ${key} parameter: You must provide a valid service type ("http" or "https"). Value received: ${value}`
      },
      granularity: {
        validator : /^(?:5min|hour|day|month)$/,
        message   : (key, value) => `Error with ${key} parameter: You must provide a valid time granularity ("5min", "hour", "day", or "month"). Value received: ${value}`
      },
      number: {
        validator : /^\d+$/,
        message   : (key, value) => `Error with ${key} parameter: You must provide a valid number. Value received: ${value}`
      }
    };
  }

  /**
   * Ensure the value valid.
   *
   * @private
   * @param  {string}      type The expected type of the value to validate against.
   * @param  {object}      data The data to validate in the format:
   *                            {key: <string>, value: <mixed>, required: <boolean>}
   * @return {string|null}      If valid, return null. If invalid, return error string.
   */
  _validateValue(type, data) {
    let typeInfo = this._types[type.toLowerCase()];
    let message  = typeInfo.message(data.key, data.value);
                   // If the value is defined...
    let isValid  = !_.isUndefined(data.value)
                   // ...then it must be a number with 10 digits...
                   ? typeInfo.validator.test(data.value)
                   // ...otherwise it's valid, unless it's required
                   : !data.required;
    return isValid ? null : message;
  }

  /**
   * Validate the values of query string parameters.
   *
   * @param {object} params Parameter data to validate (e.g. {start: 1451606400})
   * @param {object} spec   Defines the validation rules for each parameter
   *                        (e.g. {start: {required: true, type: 'Timestamp'}, ...})
   *
   * @return {string|null}  If valid, return null. If invalid, return error array.
   */
  validate(params, spec) {
    let errors = [];

    log.debug('validating params:', params);

    // Loop the properties in the spec and call the validate method that
    // corresponds to the type of the property.
    _.forOwn(spec, (value, key) => {
      let errorMessage = this._validateValue(value.type, {
        key: key,
        value: params[key],
        required: value.required
      });
      errorMessage && errors.push(errorMessage);
    });

    // Return an array of errors if any of the parameters failed validation
    return errors.length ? errors : null;
  }

}

module.exports = new Validator();
