# Ericsson UDN Portal Analytics API

This is a Node Express API that returns analytics data from a remote MySQL database for use in the Ericsson UDN Portal.

## Setup

| #  | Command       | Description                       |
|----|---------------|-----------------------------------|
| 1. | `node -v`     | Ensure node 4.2.1 is installed    |
| 2. | `npm -v`      | Ensure npm 2.14.7 is installed    |
| 3. | `npm install` | Install dependencies              |
| 4. | `npm start`   | Start API server                  |

The API is served on port 3030 by default (i.e. http://localhost:3030).

### Running in Production
The API uses the `NODE_ENV` environment variable to determine which configs to use from `./app/configs.js`. When running the API in production or staging, the following commands should be used instead of `npm start`:

- **Staging:** `npm run staging`
- **Production:** `npm run production`

**NOTE:** `npm start` runs the server in development mode by default.


## Key Files and Folders
```
.
├── app             // Everything for the API except the code to start the server is contained here.
│   ├── logs        // Flat file logs are stored here.
│   ├── routes      // All the route handlers are stored here.
│   ├── configs.js  // Config file for the app which includes environment specific configs.
│   ├── router.js   // Express router - all the API routes are mapped to handlers here.
│   └── server.js   // Express server - the server is created and configured here.
├── .eslintrc       // JavaScript linting rules with ESLint - extends ../.eslintrc
└── index.js        // `npm start` runs `node index.js` to start the server.
```

## Linting
Execute `npm run lint` to lint the JavaScript with ESLint. The `.eslintrc` file in this directory extends the one in the root of this repository.

## Logging
Logging in the API is done with [Morgan](https://github.com/expressjs/morgan) and [Winston](https://github.com/winstonjs/winston). Morgan is an HTTP request logger. It is configured to use Winston to log all HTTP requests made to the API. Winston is a library used by the API (and Morgan) to log messages.

Winston is configured to have six log levels:  
`{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }`

Morgan logs requests based on status code. Winston is configured to log messages to files in `./app/logs/`, as well as to the console for the process running the Express server.

| status code | log level | location                             |
|-------------|-----------|--------------------------------------|
| `< 400`     | info      | `level-1-warn.log` level 1 and below |
| `>= 400`    | error     | `level-2-info.log` level 2 and below |
| `all`       | debug     | `console` level 4 and below          |

The API uses an instance of Winston (located in `./app/logger.js`) to log custom messages. For example:

```js
let log = require('./logger');

log.info('Some kind of information.');
log.warn('Some kind of warning!');
log.error('Some kind of error!');
```
