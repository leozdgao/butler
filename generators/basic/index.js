var generators = require('yeoman-generator')
var utils = require('../utils')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    // set options
    this.option('name', {
      type: String,
      desc: "name of this project."
    })
    this.option('react', {
      type: Boolean,
      desc: "need to use React or not.",
      defaults: false
    })
    this.option('babel', {
      type: Boolean,
      desc: "use babel as a transpiler.",
      defaults: true
    })

    this.props = { }
  },

  prompting: function () {
    // var done = this.async()
    //
    // this.prompt({
    //   type: 'list',
    //   name: 'type',
    //   message: 'Choose your project type',
    //   choices: [
    //     { name: 'Basic for FE demo', value: 'basic' },
    //     { name: 'Express app', value: 'express' },
    //     { name: 'Library for common module', value: 'lib' }
    //   ]
    // }, answer => {
    //   this.props.type = answer.type
    //   done()
    // })
  },

  default: function () {
    if (this.options.babel) {
      this.composeWith('butler:babel', {
        options: { react: this.options.react }
      }, {
        local: require.resolve('../babel')
      })
    }
  },

  writing: function () {
    var deps = {
      "autoprefixer-loader": "^3.1.0",
      "babel-loader": "^6.2.4",
      "connect-history-api-fallback": "^1.1.0",
      "css-loader": "^0.23.0",
      "express": "^4.13.4",
      "html-webpack-plugin": "^2.9.0",
      "node-sass": "^3.4.2",
      "sass-loader": "^3.1.2",
      "style-loader": "^0.13.0",
      "webpack": "^1.12.9",
      "webpack-dev-middleware": "^1.5.1",
      "webpack-hot-middleware": "^2.8.1"
    }
    utils.writeDependencies(this, {}, deps)
    utils.extendPackageJSON(this, {
      "scripts": {
        "start": "node bin/dev"
      }
    })

    utils.copy(this)
  },

  install: function () {
    this.npmInstall()
  }
})
