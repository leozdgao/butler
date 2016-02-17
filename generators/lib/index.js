var generators = require('yeoman-generator')
var path = require('path')
var fs = require('fs')
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
  },

  default: function () {
    // execute other sub-generators
    this.composeWith('butler:npm', { name: this.options.name }, {
      local: require.resolve('../npm')
    })
    this.composeWith('butler:git', { }, {
      local: require.resolve('../git')
    })
    this.composeWith('butler:eslint', {
      options: { babel: this.options.babel, react: this.options.react }
    }, {
      local: require.resolve('../eslint')
    })
    if (this.options.babel) {
      this.composeWith('butler:babel', {
        options: { react: this.options.react, cli: true }
      }, {
        local: require.resolve('../babel')
      })
    }
  },

  writing: function () {
    utils.copy(this)
    fs.writeFileSync(path.join(this.destinationPath(), '.gitignore'), 'lib/', { flag: 'a' })
  },

  install: function () {
    this.npmInstall()
  }
})
