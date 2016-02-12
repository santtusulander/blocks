'use strict';

let exec       = require('child_process').exec;
let configs    = require('./app/configs');

// Command to run the end-to-end tests
let commandE2E = `./node_modules/.bin/newman -c ${configs.postmanCollection} -e ${configs.postmanEnvironment}`;

// Run the end-to-end tests and log the output to the console
console.log(`> ${commandE2E}`);
exec(commandE2E, processExecOutput);

/**
 * Log the output of shell commands to the console
 */
function processExecOutput(error, stdout, stderr) {

  console.log(`stdout: ${stdout || 'Something went wrong. Make sure you ran npm install.'}`);

  // Something might have gone wrong with the execution of the command
  // e.g. executable couldn't be found, incorrect arguments, etc.
  if (stderr) {
    console.log(`stderr: ${stderr || 'No errors!'}`);
  }

  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
}
