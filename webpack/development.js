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

var development = Object.assign({}, {
  // debug: true,
  devtool: 'source-map',
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
      template: 'src/scheduled_downtime.html',
      favicon: 'src/assets/icons/favicon.ico',
      filename: 'scheduled_downtime.html'
    }),
    new CopyWebpackPlugin([
      {from: 'src/assets/topo/countries.topo.json', to: 'assets/topo'},
      {from: 'src/assets/topo/states_usa.topo.json', to: 'assets/topo'},
      {from: 'src/assets/topo/cities_usa.topo.json', to: 'assets/topo'},
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
