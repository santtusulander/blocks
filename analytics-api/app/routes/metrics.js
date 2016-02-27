'use strict';

let testData = require('./metrics-data');

function routeMetrics(req, res) {
  res.json(testData({
    entityCount: 10,
    start: parseInt(req.query.start),
    end: parseInt(req.query.end)
  }));
}

module.exports = routeMetrics;
