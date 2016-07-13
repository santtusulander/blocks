var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");

var configPath = path.join(__dirname, 'webpack/development.js');
var webpackConfig = require(configPath);
var compiler = webpack(webpackConfig);

var server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: {
    /* fix dot in url problem by rewriting to index.html */
    rewrites: [
      {
        from: /^\/.*$/,
        to: function() {
          return '/index.html';
        }
      }
    ]
  },
  //was: true,
  proxy: {
    '/AAA*': {
      target: 'http://api.cdx-dev.unifieddeliverynetwork.net'
    },
    '/VCDN*': {
      target: 'http://api.cdx-dev.unifieddeliverynetwork.net'
    },
    /*'/VCDN*': {
      target: 'http://localhost:8080'
    },*/
    '/analytics*': {
      target: 'http://localhost:3030'
    }
  },
  stats: {colors: true}
});

server.listen(process.env.PORT || 3000);
