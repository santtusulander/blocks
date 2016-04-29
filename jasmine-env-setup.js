var path = require('path');

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
  savePath: path.resolve(__dirname, 'output'),
  consolidateAll: false
});
jasmine.getEnv().addReporter(junitReporter);
