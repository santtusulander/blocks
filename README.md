# Ericsson UDN portal


## Description

This is a portal for administering the Ericsson UDN.

## Development Requirements
This project requires the use of Node, Gulp, and Sass.

## Installation

### NodeJS
```shell
$ brew install node

// If you get an error message, you will likely need to use the 'sudo' command.
$ sudo brew install node
```
*Note: If you do not have Homebrew installed please visit [brew.sh](http://brew.sh/) or if you do not wish to install Homebrew visit [nodejs.org](http://nodejs.org)*

### Sass

``` shell
$ gem install sass

// If you get an error message, you will likely need to use the 'sudo' command.
$ sudo gem install sass
```

### Install the project

1. Clone the repo
   ``` shell
   $ git clone git@gitlab.idean.com:1907-Ericsson-CDN-UX/web.git ericsson-portal
   ```

2. Navigate to the cloned directory
   ``` shell
   $ cd ericsson-portal/
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
