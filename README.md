# Ericsson UDN portal


## Description

This is a portal for administering the Ericsson UDN.

## Contribution

Every pull request to this project must pass lint checks and unit tests before being reviewed. We are currently using eslint for JavaScript linting, sass-lint for Sass linting, and Jest for unit tests.

Unfortunately, if anything fails, the console output from the build is hidden behind a Jenkins login. It is not trivial to create logins for new team members, so this console output will most likely be unavailable to you. In order to avoid failing builds on Jenkins, you should be frequently checking your changes against the linters and running unit tests. See below for information on how to do this from the command line.

It can be very convenient to have these lint checks done while you are coding. For a recommended editor configuration to support this, see the next section.

Please follow our style guides and code guidelines:
 - [Code Guidelines](wiki/Code-Guidelines/)
 - [JavaScript Style Guide](wiki/JavaScript-Style-Guide/)
 - [React Style Guide](wiki/React-Style-Guide/)
 - [CSS Style Guide](wiki/CSS-Style-Guide/)

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

### Development Requirements

**NOTE ON INSTALLING NODE:** It is recommended that you use n (recommended) or nvm to manage multiple versions of node on your computer.

<table>
  <thead>
    <tr>
      <th>Required Global Dependency</th>
      <th>Check Version</th>
      <th>Download</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>node v4.2.4</td>
      <td><code>node -v</code></td>
      <td>
        <strong>n:</strong> https://github.com/tj/n
        <br>
        <strong>nvm:</strong> https://github.com/creationix/nvm
        <br>
        <strong>plain node:</strong> https://nodejs.org/en/download/
      </td>
    </tr>
    <tr>
      <td>npm v2.14.12</td>
      <td><code>npm -v</code></td>
      <td>Included with node</td>
    </tr>
    <tr>
      <td>yarn v0.17.10</td>
      <td><code>yarn --version</code></td>
      <td>https://yarnpkg.com/en/docs/install</td>
    </tr>
  </tbody>
</table>

### Install the project
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Description</th>
      <th>Command</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.</td>
      <td>Clone the repo</td>
      <td><code>$ git clone git@github.com:VidScale/udnportal.git</code></td>
    </tr>
    <tr>
      <td>2.</td>
      <td>Navigate to the cloned directory</td>
      <td><code>$ cd udnportal/</code></td>
    </tr>
    <tr>
      <td>3.</td>
      <td>Install dependencies</td>
      <td><code>$ yarn</code></td>
    </tr>
    <tr>
      <td>4.</td>
      <td>Rename <code>.env.example</code> to <code>.env</code> and configure settings</td>
      <td>NOTE: you shouldn't need to edit anything in this file, but ask another developer if you're unsure</td>
    </tr>
    <tr>
      <td>5.</td>
      <td>Follow the instructions to set up the Analytics API</td>
      <td><a href="https://github.com/VidScale/udnportal-analytics-api/blob/develop/README.md">https://github.com/VidScale/udnportal-analytics-api/blob/develop/README.md</a></td>
    </tr>
  </tbody>
</table>

## Running the application

### Development mode
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Description</th>
      <th>Command</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.</td>
      <td>Run dev server</td>
      <td>
        <strong>normal:</strong> <code>$ npm start</code>
        <br>
        <strong>source maps:</strong> <code>$ npm start -- --source-map</code>
        <br>
        <small><em>slower build that generates source maps</em></small>
      </td>
    </tr>
    <tr>
      <td>2.</td>
      <td colspan="2">Navigate to <a href="http://localhost:3000">http://localhost:3000</a></td>
    </tr>
  </tbody>
</table>


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
