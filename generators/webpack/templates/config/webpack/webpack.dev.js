const webpack = require('webpack')
// const _ = require('lodash')
const path = require('path')
const env = require('../environment')

// #DONE:40 解析enties对象 +webpack
<% if (hot) { %>
const hmrClient = 'webpack-hot-middleware/client'
const entry = [ hmrClient, env.entry ]
<% } else { %>
const entry = env.entry
<% } %>

const browsers = JSON.stringify({ browsers: [ "IOS >= 7", "Android >= 4" ] })
const cssLoader = `style!css?importLoaders=1&sourceMap!autoprefixer?${browsers}`

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry,
  output: {
    path: env.publicPath,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('development')
    })
  ],
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: `${cssLoader}!sass`,
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        loader: cssLoader,
        exclude: /node_modules/
      },
      // #TODO:0 为其他类型文件添加loader，比如字体文件，或者图片等 +webpack @dev
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file"
      }
    ]
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, "../../node_modules/normalize-scss/sass/"),
      path.resolve(__dirname, "../../node_modules/support-for/sass/"),
      path.resolve(__dirname, "../../src/__shared/sass/")
    ]
  }
}
