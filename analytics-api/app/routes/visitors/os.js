'use strict';

let testData = require('./os-data');

function routeVisitorsOS(req, res) {
    res.json(testData);
}

module.exports = routeVisitorsOS;
