const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const browsers = JSON.stringify({ browsers: [ "IOS >= 7", "Android >= 4" ] })
const cssLoader = `style!css?importLoaders=1&sourceMap!autoprefixer?${browsers}`

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [ './bin/dev-client', './src/index.js' ]
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, './src/index.html'),
      inject: true
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
      }
    ]
  }
}
