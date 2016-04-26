# Ericsson UDN portal


## Description

This is a portal for administering the Ericsson UDN.

## Development Requirements
This project requires the use of Node, Ruby, Gulp, and Sass.

## Installation

### NodeJS
This project requires Node version 4.2.1 and npm version 2.14.7.

Download at https://nodejs.org/en/download/

### Ruby

Install ruby as instructed for your platform
https://www.ruby-lang.org/en/documentation/installation/
```

### Sass

``` shell
$ gem install sass scss_lint

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
1. Rename .env.example to .env and configure settings

2. Run dev server
   ``` shell
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
