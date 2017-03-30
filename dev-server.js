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
    '/v2/service_info': {
      target: 'https://aaa-dal.cdx-dev.unifieddeliverynetwork.net:7999',
      secure: false
    },
    '/v2': {
      target: 'https://saltmaster.cdx-dev.unifieddeliverynetwork.net',
      secure: false
    },
    '/VCDN': {
      target: 'https://saltmaster.cdx-dev.unifieddeliverynetwork.net',
      secure: false
    },
    '/cis_north': {
      target: 'http://cis-eu-fra1-srvc0-north0.cdx-dev.unifieddeliverynetwork.net:8080',
      secure: false,
      pathRewrite: {
        '/cis_north' : ''
      }
    },
    '/cis_south': {
      target: 'http://cis-eu-fra1-srvc0-south0.cdx-dev.unifieddeliverynetwork.net:8080',
      secure: false,
      pathRewrite: {
        '/cis_south' : ''
      }
    },
    '/analytics-legacy': {
      target: 'http://mapi.sjc.cdx-dev.unifieddeliverynetwork.net:3030',
      pathRewrite: {
        '^/analytics-legacy([^?]*)\\??(.*)$' : '/legacy$1/?$2'
      }
    },

    '/analytics': {
      target: 'http://portal-analytics.dal.cdx-dev.unifieddeliverynetwork.net:3030',
      pathRewrite: {
        '^/analytics([^-][^?]*)\\??(.*)$' : '/analytics/$1/?$2'
      }
    }
  },
  stats: {colors: true}
});

server.listen(process.env.PORT || 3000);
