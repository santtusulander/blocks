# Ericsson UDN portal


## Description

This is a portal for administering the Ericsson UDN.

## Development Requirements
This project requires the use of Node and Sass.

## Installation

### NodeJS
This project requires Node version 4.2.1 and npm version 2.14.7.

Download at https://nodejs.org/en/download/

### Install the project

1. Clone the repo
   ```shell
   $ git clone git@github.com:VidScale/udnportal.git
   ```

2. Navigate to the cloned directory
   ```shell
   $ cd udnportal/
   ```

3. Install dependencies
   ```shell
   $ npm install
   ```

## Running the application

### Development mode
1. Rename .env.example to .env and configure settings

2. Run dev server
   ```shell
   $ npm start
   ```

  or with source-maps (slower build)
  ```shell
  $ npm start -- --source-map
  ```

3. Navigate to http://localhost:3000

### Building for deployment

```shell
$ npm run dist
```

### Unit Testing
Run all unit tests:

```shell
$ npm test
```

Run a subset of the unit tests based on a provided regular expression:

```shell
$ npm test -- [RegExp]
$ npm test -- service-provider.js
$ npm test -- containers/.+?/config
```

Run all units without printing stack traces:

```shell
$ npm test -- --noStackTrace
```

NOTE: `npm test` is basically just an alias for the `jest` CLI. Execute `$ npm test -- --help` to see a list of all supported CLI options.

### End to End Testing

#### Installation

1. Install Java for your system https://www.java.com/en/download/

2. Download the selenium binaries
```shell
$ npm run-script e2e-setup
```

#### Running
```shell
$ npm run e2e
```

### Component Lib
1. Run server
   ```shell
   $ npm run storybook
   ```

2. Navigate to http://localhost:9001/

### Linting
Lint JS-files:
```shell
$ npm run lint:js
```

Lint styles:
```shell
$ npm run lint:styles
```
