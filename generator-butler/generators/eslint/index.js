var generators = require('yeoman-generator')
var utils = require('../utils')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('babel', {
      type: Boolean,
      desc: "use babel as a transpiler.",
      defaults: true
    })
    this.option('react', {
      type: Boolean,
      desc: "need to use React or not.",
      defaults: false
    })
  },

  writing: function () {
    utils.copyTpl(this, '.eslintrc', {
      needBabel: this.options.babel,
      needReact: this.options.react
    })
    utils.copy(this, '.eslintignore')

    var deps = {
      "eslint": "^1.10.3"
    }
    if (this.options.babel) deps['babel-eslint'] = '^4.1.8'
    if (this.options.react) deps['eslint-plugin-react'] = '^3.16.1'

    utils.writeDependencies(this, { }, deps)
  }
})
