'use strict';

require('express-jsend');
let _       = require('lodash');
let axios   = require('axios');
let configs = require('./configs');
let log     = require('./logger');

// Build an HTTP client instance to interface with the AAA auth API
const axiosAAA = axios.create({
  baseURL: configs.aaaBaseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

function unauthorized(res, status, message) {
  status = status || 401;
  message = message || 'Unauthorized';
  log.error(`Authentication Error (${status}): ${message}`);
  res.status(status).jerror(message);
}

function auth(req, res, next) {
  const token = req.header('X-Auth-Token');

  // Send the token in the X-Auth-Token header
  if (token) {
    axiosAAA.defaults.headers.common['X-Auth-Token'] = token;

  // If the token doesn't exist, throw a 401
  } else {
    log.debug('No token was provided.');
    return unauthorized(res, 401, 'No token was provided');
  }

  // Reference the AAA API to check the validity of the token
  log.debug('Checking validity of token');
  axiosAAA.get(`/tokens/${token}`).then(resp => {
    const data                             = resp.data;
    // NOTE: userAccount is the account ID the user is associated with
    const userAccount                      = data.account_id;
    const requestedAccount                 = req.query.account || req.query.sp_account;
    const userCanListAccounts              = _.get(data, 'services.AAA.permissions.resources.accounts.list.allowed', false);
    const userIsTryingToAccessWrongAccount = !userCanListAccounts && (userAccount != requestedAccount);

    // If the user is not allowed to list accounts, and they are trying to request
    // data for an account (or all accounts) they do not belong to, respond with 403.
    if (userIsTryingToAccessWrongAccount) {
      log.debug(`User is trying to access wrong account.`);
      return unauthorized(res, 403, `This user may only access data for their account.`);
    }

    // Allow the request to continue on to the router
    log.debug(`Token authorized for user.`);
    next();

  // We couldn't validate the user token with the AAA API
  }).catch(err => {
    const data = err.response.data;
    log.debug(`Token could not be validated by AAA.`);
    return unauthorized(res, data.status, data.message);
  });
}

module.exports = auth;
