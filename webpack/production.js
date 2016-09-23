var path                 = require('path');
var webpack              = require('webpack');
var CopyWebpackPlugin    = require('copy-webpack-plugin');
var ExtractTextPlugin    = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin    = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var helpers              = require('./helpers');

var environment = helpers.parseDotenvConfig(
  require('dotenv').config(path.resolve(__dirname, '../.env'))
);

module.exports = Object.assign({}, {
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {
      'process.env.NODE_ENV': '"production"',
      'VERSION': JSON.stringify(require('../package.json').version)
    }, environment)),
    new webpack.ProvidePlugin({
      // Polyfill here
    }),
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html',
      favicon: 'src/assets/icons/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/downtime.html',
      favicon: 'src/assets/icons/favicon.ico',
      filename: 'downtime.html'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/downtime_scheduled.html',
      favicon: 'src/assets/icons/favicon.ico',
      filename: 'downtime_scheduled.html'
    }),
    new CopyWebpackPlugin([
      {from: 'src/assets/topo/countries.topo.json', to: 'assets/topo'},
      {from: 'src/assets/topo/states_usa.topo.json', to: 'assets/topo'},
      {from: 'src/assets/topo/cities_usa.topo.json', to: 'assets/topo'},
      {from: 'src/assets/pdf/CP_User_Guide.pdf', to: 'assets/pdf'},
      {from: 'src/assets/pdf/SP_User_Guide.pdf', to: 'assets/pdf'},
      {from: 'src/assets/pdf/UDN_Admin_Guide.pdf', to: 'assets/pdf'},
      {from: 'src/assets/icons/favicon.ico', to: 'assets/icons'},
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new WebpackCleanupPlugin()
  ]
}, require('./config'));
