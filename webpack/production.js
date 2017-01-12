var path                 = require('path');
var webpack              = require('webpack');
var ExtractTextPlugin    = require('extract-text-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

var helpers              = require('./helpers');

var environment = helpers.parseDotenvConfig(
  require('dotenv').config(path.resolve(__dirname, '../.env'))
);
const googleSiteKey = environment.GOOGLE_SITE_KEY || '6LfO1AoUAAAAAKy1rnqNJzAqDXxoHnUAKdRfY5vB'
const mapboxAccessToken = environment.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXJpY3Nzb251ZG4iLCJhIjoiY2lyNWJsZGVmMDAxYmcxbm5oNjRxY2VnZCJ9.r1KILF4ik_gkwZ4BCyy1CA'

module.exports = Object.assign({}, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {
      'process.env.NODE_ENV': '"production"',
      'GOOGLE_SITE_KEY': `"${googleSiteKey}"`,
      'VERSION': JSON.stringify(require('../package.json').version),
      'MAPBOX_ACCESS_TOKEN': `"${mapboxAccessToken}"`
    }, environment)),
    new webpack.ProvidePlugin({
      // Polyfill here
    }),
    new ExtractTextPlugin('style.[hash].css'),
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
