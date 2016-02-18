// #DONE:20 webpack生产模式配置 +webpack
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const env = require('../environment')

const browsers = JSON.stringify({ browsers: [ "IOS >= 7", "Android >= 4" ] })
const cssLoader = `css?importLoaders=1&sourceMap!autoprefixer?${browsers}`

module.exports = {
  devtool: 'source-map',
  entry: env.entry,
  output: {
    path: env.publicPath,
    filename: '[chunkhash].js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
    new ExtractTextPlugin('[chunkhash].css'),
    new AssetsPlugin({
      path: env.publicPath,
      filename: 'assets-client.json'
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
        loader: ExtractTextPlugin.extract('style', `${cssLoader}!sass`),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', cssLoader),
        exclude: /node_modules/
      },
      // #TODO:10 为其他类型文件添加loader，比如字体文件，或者图片等 +webpack @prod
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  },
  externals: {
    // wx: 'wx'
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, "../../node_modules/normalize-scss/sass/"),
      path.resolve(__dirname, "../../node_modules/support-for/sass/"),
      path.resolve(__dirname, "../../src/__shared/sass/")
    ]
  }
}
