var path = require('path');
var ExtractTextPlugin    = require('extract-text-webpack-plugin');

const isProductionBuild = () => (process.argv.indexOf('--production-build') !== -1)

const publicUrl = isProductionBuild()
  ? process.env.PUBLIC_URL || '/'
  : `${process.env.SCHEMA}://${process.env.HOST}:${process.env.PORT}/`

module.exports = {
  entry: {
    app: [path.resolve(__dirname, '../src/app.jsx')]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
    publicPath: publicUrl,
    sourceMapFilename: '[file].map',
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

    // Added to avoid webpack warning: This seems to be a pre-built javascript file. Though this is possible, it's not recommended. Try to require the original source to get better results. @ ./~/mapbox-gl/dist/mapbox-gl.js 1:481-488
    // https://github.com/mapbox/mapbox-gl-js/issues/2742#issuecomment-267001402
    noParse: /node_modules\/mapbox-gl\/dist\/mapbox-gl.js/,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?cacheDirectory'
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
