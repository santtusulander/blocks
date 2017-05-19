var path                  = require('path');
var webpack               = require('webpack');
var helpers               = require('./helpers');

//var ExtractTextPlugin     = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');

var environment = helpers.parseDotenvConfig(
  require('dotenv').config(path.resolve(__dirname, '../.env'))
);

const publicUrl = process.env.PUBLIC_URL || `${process.env.SCHEMA}://${process.env.HOST}:${process.env.PORT}/`

const googleSiteKey = environment.GOOGLE_SITE_KEY || '6LfO1AoUAAAAAKy1rnqNJzAqDXxoHnUAKdRfY5vB'
const mapboxAccessToken = environment.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXJpY3Nzb251ZG4iLCJhIjoiY2lyNWJsZGVmMDAxYmcxbm5oNjRxY2VnZCJ9.r1KILF4ik_gkwZ4BCyy1CA'

const useSourceMap = () => (process.argv.indexOf('--source-map') !== -1)
const useHMR = () => (process.argv.indexOf('--no-hmr') === -1)

var plugins = [
  new webpack.DefinePlugin(Object.assign({}, {
      'process.env.NODE_ENV': '"development"',
      'process.env.PUBLIC_URL': `"${publicUrl}"`,
      'ANALYTICS_BASE_URI_DEVELOPMENT_LEGACY': `"${publicUrl}analytics-legacy"`,
      'ANALYTICS_BASE_URI_DEVELOPMENT': `"${publicUrl}analytics"`,
      'TOPO_BASE_URI_DEVELOPMENT': `"${publicUrl}assets/topo"`,
      'GOOGLE_SITE_KEY': `"${googleSiteKey}"`,
      'VERSION': JSON.stringify(require('../package.json').version),
      'MAPBOX_ACCESS_TOKEN': `"${mapboxAccessToken}"`
    }, environment)),
    new webpack.ProvidePlugin({
      // Polyfill here
    }),
    new webpack.NoErrorsPlugin(),
    new WebpackNotifierPlugin({
      title: `UDN portal v.${require('../package.json').version}`
    })
].concat(helpers.staticAssets)

if (useHMR()) {
  plugins.unshift(new webpack.HotModuleReplacementPlugin())
}

var development = Object.assign({}, {
  // debug: true,
  devtool: useSourceMap() ? 'eval-source-map' : 'eval',
  plugins
}, require('./config'));

if (useHMR()) {
  development.entry.app.unshift('react-hot-loader/patch');
  development.entry.app.unshift('webpack/hot/only-dev-server');
}
development.entry.app.unshift('webpack-dev-server/client?' + publicUrl);

module.exports = development;
