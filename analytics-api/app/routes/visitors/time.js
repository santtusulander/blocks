'use strict';

let testData = require('./time-data');

function routeVisitorsTime(req, res) {
  res.json(testData);
}

module.exports = routeVisitorsTime;
