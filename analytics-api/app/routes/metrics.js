'use strict';

let testData = require('./metrics-data');

function routeMetrics(req, res) {
    res.json(testData);
}

module.exports = routeMetrics;
