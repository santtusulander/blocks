var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = require('../config');

var assetCopy = new CopyWebpackPlugin([
  {from: 'src/assets/topo/countries.topo.json', to: 'assets/topo'},
  {from: 'src/assets/topo/states_usa.topo.json', to: 'assets/topo'},
  {from: 'src/assets/topo/cities_usa.topo.json', to: 'assets/topo'}
]);

gulp.task("webpack", function(callback) {
  var dev = process.env.NODE_ENV === 'development';
  var webpackConfig = config.webpack;
  webpackConfig.debug = dev;
  if(dev) {
    webpackConfig.devtool = "source-map";
    webpackConfig.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      assetCopy
    ];
    Object.keys(webpackConfig.entry).map(function(key){
      webpackConfig.entry[key].unshift('webpack-dev-server/client?http://localhost:'+config.webpackPort);
      webpackConfig.entry[key].unshift('webpack/hot/only-dev-server');
    });
    new WebpackDevServer(webpack(webpackConfig), {
      hot: true,
      historyApiFallback: true,
      stats: {
        colors: true
      }
    }).listen(config.webpackPort, "localhost", function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server]", "http://localhost:"+config.webpackPort+"/webpack-dev-server/index.html");
      callback();
    });
  }
  else {
    webpackConfig.plugins = [
      // new webpack.optimize.UglifyJsPlugin({minimize: true}),
      new ExtractTextPlugin("styles/style.css"),
      assetCopy
    ];
    webpackConfig.module.loaders.forEach(function(loader, i) {
      if(loader.test.test('.scss')) {
        webpackConfig.module.loaders[i].loader = ExtractTextPlugin.extract('style', 'css!autoprefixer?{browsers:["last 2 version", "IE 9"]}!sass');
        delete webpackConfig.module.loaders[i].loaders;
      }
    })
    webpack(webpackConfig, function(err, stats) {
      if(err) throw new gutil.PluginError("webpack:build", err);
      gutil.log("[webpack:build]", stats.toString({
        colors: true
      }));
      callback();
    });
  }
});
