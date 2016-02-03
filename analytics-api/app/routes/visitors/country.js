'use strict';

let testData = require('./country-data');

function routeVisitorsCountry(req, res) {
    res.json(testData);
}

module.exports = routeVisitorsCountry;
