var generators = require('yeoman-generator')
var utils = require('../utils')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('hot', {
      type: Boolean,
      desc: 'use webpack hmr module.',
      defaults: false
    })
  },
  writing: function () {
    utils.copyTpl(this, { hot: this.options.hot })

    utils.writeDependencies(this, { }, {
      "assets-webpack-plugin": "^3.2.0",
      "autoprefixer-loader": "^3.1.0",
      "babel-loader": "^6.2.0",
      "css-loader": "^0.23.0",
      "extract-text-webpack-plugin": "^0.9.1",
      "sass-loader": "^3.1.2",
      "style-loader": "^0.13.0",
      "node-sass": "^3.4.2",
      "webpack": "^1.12.9",
      "url-loader": "^0.5.7"
    })
  }
})
