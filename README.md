# Ericsson UDN portal


## Description

This is a portal for administering the Ericsson UDN.

## Development Requirements
This project requires the use of Node, Gulp, and Sass.

## Installation

### NodeJS

Download at https://nodejs.org/en/download/

### Gulp

``` shell
$ npm install -g gulp

// If you get an error message, you will likely need to use the 'sudo' command.
$ sudo npm install -g gulp
```

### Sass

``` shell
$ gem install sass

// If you get an error message, you will likely need to use the 'sudo' command.
$ sudo gem install sass
```

### Install the project

1. Clone the repo
   ``` shell
   $ git clone git@github.com:VidScale/udnportal.git
   ```

2. Navigate to the cloned directory
   ``` shell
   $ cd udnportal/
   ```

3. Install dependencies
   ``` shell
   $ npm install
   ```

## Running the application

### Development mode

1. Run Gulp
   ``` shell
   $ gulp
   ```

2. Navigate to http://localhost:3000/webpack-dev-server/

### Building for deployment

```shell
$ gulp build
```

### Testing
```shell
$ npm test
```
