var generators = require('yeoman-generator')

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
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc'),
      { needBabel: this.options.babel, needReact: this.options.react }
    )

    this.fs.copy(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore')
    )
  },
  install: function () {
    var deps = [
      'eslint'
    ]
    if (this.options.babel) deps.push('babel-eslint')
    if (this.options.react) deps.push('eslint-plugin-react')

    this.npmInstall(deps, { saveDev: true })
  }
})
