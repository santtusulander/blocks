var path = require('path');
//
module.exports = {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?sourceMap',
          "autoprefixer?{browsers:['last 2 version', 'IE 9']}",
          'sass?sourceMap'
        ]
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: /node_modules/,
        loader: 'file?name=src/assets/img/[name].[ext]'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /(node_modules|img|icons)/,
        loader: 'file?name=src/assets/fonts/[name].[ext]'
      },
      {
        test: /\.(svg|ico)$/,
        exclude: /(node_modules|fonts|img)/,
        loader: 'file?name=src/assets/icons/[name].[ext]'
      },
      {
        test: /\.svg$/,
        exclude: /(node_modules|fonts|icons)/,
        loader: 'file?name=src/assets/img/[name].[ext]'
      },
      {
        test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  }
};
