var generators = require('yeoman-generator')
var _ = require('lodash')
var utils = require('../utils')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('react', {
      type: Boolean,
      desc: 'need to use React or not.',
      defaults: false
    })
    this.option('cli', {
      type: Boolean,
      desc: 'need cli for babel (enable it when writing a library)'
    })
  },

  prompting: function () {
    if (_.isUndefined(this.options.cli)) {
      var done = this.async()

      this.prompt({
        type: 'confirm',
        name: 'needCli',
        message: 'need cli for babel? (enable it when writing a library)',
        default: false
      }, answer => {
        this.options.cli = answer.needCli
        done()
      })
    }
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
        'babel': '^6.5.1',
        'babel-core': '^6.5.1',
        'babel-preset-es2015': '^6.5.0',
        'babel-preset-stage-0': '^6.5.0'
      }
      if (this.options.react) deps['babel-preset-react'] = '^6.5.0'
      if (this.options.cli) {
        deps['babel-cli'] = '^6.5.1'
      }

      var pkg = {
        devDependencies: deps
      }
      if (this.options.cli) {
        pkg.scripts = {
          prepublish: "babel ./src/ -d ./lib"
        }
      }

      utils.extendPackageJSON(this, pkg)
    }
  }
})
