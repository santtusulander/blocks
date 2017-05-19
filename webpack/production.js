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
const accountsToExclude = environment.BRAND_DASHBOARD_ACCOUNTS_TO_EXCLUDE || ''

// credit: http://stackoverflow.com/a/38733864/2715
const isExternal = module => {
  const userRequest = module.userRequest

  if (typeof userRequest !== 'string') {
    return false
  }

  return userRequest.indexOf('node_modules') >= 0
}

module.exports = Object.assign({}, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {
      'process.env.NODE_ENV': '"production"',
      'GOOGLE_SITE_KEY': `"${googleSiteKey}"`,
      'VERSION': JSON.stringify(require('../package.json').version),
      'MAPBOX_ACCESS_TOKEN': `"${mapboxAccessToken}"`,
      'BRAND_DASHBOARD_ACCOUNTS_TO_EXCLUDE': `"${accountsToExclude}"`
    }, environment)),
    new webpack.ProvidePlugin({
      // Polyfill here
    }),
    new ExtractTextPlugin('style.[hash].css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: module => isExternal(module)
    })
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
