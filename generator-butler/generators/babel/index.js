var generators = require('yeoman-generator')
var extend = require('deep-extend')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('react', {
      type: Boolean,
      desc: "need to use React or not.",
      defaults: false
    })
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      { needReact: this.options.react }
    )

    // reformat json file
    var content = this.fs.readJSON(this.destinationPath('.babelrc'), { })
    this.fs.writeJSON(this.destinationPath('.babelrc'), content)

    // add dependencies
    // var pkg = this.fs.readJSON(this.destinationPath('package.json'))
    // extend(pkg, {
    //   devDependencies: {
    //
    //   }
    // })
    //
    // this.fs.writeJSON(this.destinationPath('package.json'), pkg)
  },

  install: function () {
    var deps = [
      'babel', 'babel-core',
      'babel-preset-es2015',
      'babel-preset-stage-0'
    ]
    if (this.options.react) deps.push('babel-preset-react')
    this.npmInstall(deps, { saveDev: true })
  }
})
