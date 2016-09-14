var path = require('path');
var ExtractTextPlugin    = require('extract-text-webpack-plugin');

const isProductionBuild = () => (process.argv.indexOf('--production-build') !== -1)

const publicUrl = process.env.PUBLIC_URL || '/'

module.exports = {
  entry: {
    app: [path.resolve(__dirname, '../src/app.jsx')]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
    publicPath: isProductionBuild() ? publicUrl : `http://localhost:${process.env.PORT}/`,
    sourceMapFilename: '[name].[hash].js.map',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    /* NOT NEEDED?
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'source-map'
      }
    ],*/
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'react-hot!babel-loader?cacheDirectory'
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loader:
          isProductionBuild() ?
            ExtractTextPlugin.extract(
              'style',
              [
                'css?sourceMap',
                "autoprefixer?{browsers:['last 2 version', 'IE 9']}",
                'sass?sourceMap'
              ]
            )
          :
            "style!css?sourceMap!autoprefixer?{browsers:['last 2 version', 'IE 9']}!sass?sourceMap"
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: /node_modules/,
        loader: 'file?name=assets/img/[name].[ext]'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /(node_modules|img|icons)/,
        loader: 'file?name=assets/fonts/[name].[ext]'
      },
      {
        test: /\.(svg|ico)$/,
        exclude: /(node_modules|fonts|img)/,
        loader: 'file?name=assets/icons/[name].[ext]'
      },
      {
        test: /\.svg$/,
        exclude: /(node_modules|fonts|icons)/,
        loader: 'file?name=assets/img/[name].[ext]'
      },
      {
        test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  }
};
