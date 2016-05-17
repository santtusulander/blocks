const path = require('path')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: /node_modules/,
        loader: 'file?name=assets/img/[name].[ext]'
      },
      {
        test   : /\.scss$/,
        loaders: ["style", "css", "sass"],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  }
};
