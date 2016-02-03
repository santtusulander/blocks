'use strict';

let testData = require('./country-data');

function routeTrafficCountry(req, res) {
    res.json(testData);
}

module.exports = routeTrafficCountry;
