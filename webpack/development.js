var path                  = require('path');
var webpack               = require('webpack');
var CopyWebpackPlugin     = require('copy-webpack-plugin');
var ExtractTextPlugin     = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin     = require('html-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var helpers               = require('./helpers');

var environment = helpers.parseDotenvConfig(
  require('dotenv').config(path.resolve(__dirname, '../.env'))
);
const useSourceMap = () => (process.argv.indexOf('--source-map') !== -1)

var development = Object.assign({}, {
  // debug: true,
  devtool: useSourceMap() ? 'eval-source-map' : 'eval',
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {
      'process.env.NODE_ENV': '"development"',
      'VERSION': JSON.stringify(require('../package.json').version)
    }, environment)),
    new webpack.ProvidePlugin({
      // Polyfill here
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
      {from: 'src/assets/icons/favicon.ico', to: 'assets/icons'}
    ]),
    new WebpackNotifierPlugin({
      title: `UDN portal v.${require('../package.json').version}`
    })
  ]
}, require('./config'));

development.entry.app.push('webpack-dev-server/client?http://localhost:' + process.env.PORT);
development.entry.app.push('webpack/hot/only-dev-server');

module.exports = development;
