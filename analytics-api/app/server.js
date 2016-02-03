'use strict';

let express = require("express");
let router  = require('./router');
let app     = express();

app.use('/', router);

module.exports = app;
