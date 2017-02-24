var CopyWebpackPlugin     = require('copy-webpack-plugin');
var HtmlWebpackPlugin     = require('html-webpack-plugin');

/**
 *
 * @param {Object} config
 * @return {Object}
 */
module.exports = {
  parseDotenvConfig: function (config) {
    const define = {};
    for (var key in config) {
      if (config.hasOwnProperty(key)) {
        define[key] = JSON.stringify(config[key]);
      }
    }
    return define;
  },

  staticAssets: [
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
      {from: 'src/assets/iata-codes.json', to: 'assets/iata-codes'},
      {from: 'src/assets/topo/states_usa.topo.json', to: 'assets/topo'},
      {from: 'src/assets/topo/cities_usa.topo.json', to: 'assets/topo'},
      {from: 'src/assets/img/logo-udn-dark.png', to: 'assets/img'},
      {from: 'src/assets/icons/favicon.ico', to: 'assets/icons'},
      {from: 'src/assets/js/asperaweb-4.min.js', to: 'assets/js'},
      {from: 'src/assets/js/connectinstaller-4.min.js', to: 'assets/js'}
    ])
  ]
}
