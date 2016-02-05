# Ericsson UDN Portal Analytics API

This is a Node Express API that returns analytics data from a remote MySQL database for use in the Ericsson UDN Portal.

## Setup

| #  | Command       | Description                       |
|----|---------------|-----------------------------------|
| 1. | `node -v`     | Ensure node >= 5.5.0 is installed |
| 2. | `npm install` | Install dependencies              |
| 3. | `npm start`   | Start API server                  |

API is served on [http://localhost:3030](http://localhost:3030).


## Key Files and Folders
```
.
├── app             // Everything for the API except the code to start the server is contained here.
│   ├── logs        // Flat file logs are stored here.
│   ├── routes      // All the route handlers are stored here.
│   ├── router.js   // Express router - all the API routes are mapped to handlers here.
│   └── server.js   // Express server - the server is created and configured here.
├── .eslintrc       // JavaScript linting rules with ESLint - extends ../.eslintrc
└── index.js        // `npm start` runs `node index.js` to start the server.
```
