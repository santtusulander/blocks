var path                  = require('path');
var webpack               = require('webpack');
var helpers               = require('./helpers');

//var ExtractTextPlugin     = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');

var environment = helpers.parseDotenvConfig(
  require('dotenv').config(path.resolve(__dirname, '../.env'))
);
const googleSiteKey = environment.GOOGLE_SITE_KEY || '6LfO1AoUAAAAAKy1rnqNJzAqDXxoHnUAKdRfY5vB'
const useSourceMap = () => (process.argv.indexOf('--source-map') !== -1)

var development = Object.assign({}, {
  // debug: true,
  devtool: useSourceMap() ? 'eval-source-map' : 'eval',
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {
      'process.env.NODE_ENV': '"development"',
      'GOOGLE_SITE_KEY': `"${googleSiteKey}"`,
      'VERSION': JSON.stringify(require('../package.json').version)
    }, environment)),
    new webpack.ProvidePlugin({
      // Polyfill here
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new WebpackNotifierPlugin({
      title: `UDN portal v.${require('../package.json').version}`
    })
  ]
  .concat(
    helpers.staticAssets
  )
}, require('./config'));

development.entry.app.push('webpack-dev-server/client?http://localhost:' + process.env.PORT);
development.entry.app.push('webpack/hot/only-dev-server');

module.exports = development;
