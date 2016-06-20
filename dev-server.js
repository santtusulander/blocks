var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");

var configPath = path.join(__dirname, 'webpack/development.js');
var webpackConfig = require(configPath);
var compiler = webpack(webpackConfig);

var server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/VCDN*': {
      target: 'http://api.cdx-stag.unifieddeliverynetwork.net'
    },
    '/analytics*': {
      target: 'http://localhost:3030'
    }
  },
  stats: {colors: true}
});

server.listen(process.env.PORT || 3000);
