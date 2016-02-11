var babelJest = require("babel-jest");
var preprocess = require('preprocess');

module.exports = {
  process: function(src, filename) {
    src = preprocess.preprocess(src, {PACKAGE_VERSION: 'test'})
    return babelJest.process(src, filename);
  }
};
