'use strict';
let _   = require('lodash');
let log = require('./logger');


/**
 * A collection of validation functions.
 * NOTE: This file exports an instance of this class, effectively making it a singleton.
 * @class
 */
class Validate {

  /**
   * Ensure the value is a 10 digit number (seconds elapsed since UNIX epoch).
   *
   * @private
   * @param  {object}      data The data to validate in the format:
   *                            {key: <string>, value: <mixed>, required: <boolean>}
   * @return {string|null}      If valid, return null. If invalid, return error string.
   */
  _validateTimestamp(data) {
    let message = `Error with ${data.key} parameter: You must provide a valid date (seconds elapsed since UNIX epoch). Value received: ${data.value}`;
                  // If the value is defined...
    let isValid = !_.isUndefined(data.value)
                  // ...then it must be a number with 10 digits...
                  ? /^\d{10}$/.test(data.value)
                  // ...otherwise it's valid, unless it's required
                  : !data.required;
    return isValid ? null : message;
  }

  /**
   * Ensure the value is a number.
   *
   * @private
   * @param  {object}      data The data to validate in the format:
   *                            {key: <string>, value: <mixed>, required: <boolean>}
   * @return {string|null}      If valid, return null. If invalid, return error string.
   */
  _validateID(data) {
    let message = `Error with ${data.key} parameter: You must provide a valid ID (number). Value received: ${data.value}`;
                  // If the value is defined...
    let isValid = !_.isUndefined(data.value)
                  // ...then it must be a number...
                  ? /^\d+$/.test(data.value)
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
  params(params, spec) {
    let errors = [];

    log.debug('validating params:', params);

    // Loop the properties in the spec and call the validate method that
    // corresponds to the type of the property.
    _.forOwn(spec, (value, key) => {
      let errorMessage = this[`_validate${value.type}`]({
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

module.exports = new Validate();
