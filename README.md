# Ericsson UDN portal


## Description

This is a portal for administering the Ericsson UDN.

## Development Requirements
This project requires the use of Node and Sass.

### Contribution

Every pull request to this project must pass lint checks and unit tests before being reviewed. We are currently using eslint for JavaScript linting, sass-lint for Sass linting, and Jest for unit tests.

Unfortunately, if anything fails, the console output from the build is hidden behind a Jenkins login. It is not trivial to create logins for new team members, so this console output will most likely be unavailable to you. In order to avoid failing builds on Jenkins, you should be frequently checking your changes against the linters and running unit tests. See below for information on how to do this from the command line.

It can be very convenient to have these lint checks done while you are coding. For a recommended editor configuration to support this, see the next section.

### Recommended editor

We strongly recommend the use of Atom with the following plugins installed:
- [linter]
- [linter-eslint]
- [linter-sass-lint]
- [react]

The following plugins can be helpful as well:

- [atom-lcov] &mdash; see unit test coverage in each file
- [autocomplete-paths] &mdash; avoid importing from the wrong file path

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

Run unit tests on-demand while you work:

```shell
$ npm run test:watch
$ npm test:watch -- [RegExp]
$ npm test:watch -- service-provider.js
$ npm test:watch -- containers/.+?/config
```

Generate test coverage report:

```shell
$ npm run test:coverage
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

 [linter]: https://atom.io/packages/linter
 [linter-eslint]: https://atom.io/packages/linter-eslint
 [linter-sass-lint]: https://atom.io/packages/linter-sass-lint
 [react]: https://atom.io/packages/react
 [atom-lcov]: https://atom.io/packages/atom-lcov
 [autocomplete-paths]: https://atom.io/packages/autocomplete-paths
