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

3. Navigate to http://localhost:3000/webpack-dev-server/

### Building for deployment

```shell
$ npm run dist
```

### Testing
```shell
$ npm test
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
