var generators = require('yeoman-generator')
var utils = require('../utils')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('react', {
      type: Boolean,
      desc: "need to use React or not.",
      defaults: false
    })
  },

  writing: {
    files: function () {
      utils.copyTpl(this, '.babelrc', { needReact: this.options.react })

      // reformat json file
      var content = this.fs.readJSON(this.destinationPath('.babelrc'), { })
      this.fs.writeJSON(this.destinationPath('.babelrc'), content)
    },
    pkg: function () {
      // add dependencies
      var deps = {
        "babel": "^6.5.1",
        "babel-core": "^6.5.1",
        "babel-preset-es2015": "^6.5.0",
        "babel-preset-stage-0": "^6.5.0",
        "eslint": "^1.10.3"
      }
      if (this.options.react) deps['babel-preset-react'] = '^6.5.0'

      utils.writeDependencies(this, { }, deps)
    }
  }
})
