import validator from 'validator'

/**
 * Global validators
 * @see https://github.com/chriso/validator.js#validators
 */

/**
 * Check for valid email
 * @param email
 */
export function isEmail(email) {
  return validator.isEmail(email)
}
