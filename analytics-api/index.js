'use strict';

let app = require('./app/server');

app.listen(3030, function () {
    console.log("UDN Portal Analytics API server listening on http://localhost:3030");
});
