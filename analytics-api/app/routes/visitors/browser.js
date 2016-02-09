'use strict';

let testData = require('./browser-data');

function routeVisitorsBrowser(req, res) {
  res.json(testData);
}

module.exports = routeVisitorsBrowser;
