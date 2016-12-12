var path                 = require('path');
var webpack              = require('webpack');
var ExtractTextPlugin    = require('extract-text-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

var helpers              = require('./helpers');

var environment = helpers.parseDotenvConfig(
  require('dotenv').config(path.resolve(__dirname, '../.env'))
);

module.exports = Object.assign({}, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {
      'process.env.NODE_ENV': '"production"',
      'VERSION': JSON.stringify(require('../package.json').version)
    }, environment)),
    new webpack.ProvidePlugin({
      // Polyfill here
    }),
    new ExtractTextPlugin('style.css'),
    ]
    .concat( helpers.staticAssets )
    .concat([
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new WebpackCleanupPlugin()
    ])
}, require('./config'));
