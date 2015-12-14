var path = require('path');

var src = path.join(__dirname, '../src/');
var dist = path.join(__dirname, '../dist/');

module.exports = {
  webpackPort: '3000',
  html: {
    src: src + '/index.html',
    dest: dist
  },
  scss: {
    src: './src/styles/**/*.scss',
    dest: dist + '/styles',
    lint: '.scss-lint.yml',
    autoprefixer: {
      browsers: ['last 2 versions', 'IE 9']
    }
  },
  webpack: {
    entry: {
      javascript: [src + 'app.jsx'],
      html: [src + 'index.html'],
      css: [src + 'styles/style.scss']
    },
    output: {
      publicPath: 'http://localhost:3000',
      path: dist,
      filename: 'js/app.js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loaders: ['react-hot', 'babel-loader', 'preprocess']
        },
        {
          test: /\.html$/,
          loader: "file?name=[name].[ext]!preprocess"
        },
        {
          test: /\.scss$/,
          loaders: [
            "style",
            "css?sourceMap",
            'autoprefixer?{browsers:["last 2 version", "IE 9"]}',
            "sass?sourceMap"
          ]
        },
        {
          test: /\.(jpg|jpeg|gif|png)$/,
          exclude: /node_modules/,
          loader:'file?name=/assets/images/[name].[ext]'
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          exclude: /node_modules/,
          loader: 'file?name=/assets/fonts/[name].[ext]'
        }
      ]
    }
  },
  dist: {
    src: src,
    dest: dist
  }
}
