'use strict';

let testData = require('./time-data');

function routeTrafficTime(req, res) {
    res.json(testData);
}

module.exports = routeTrafficTime;
