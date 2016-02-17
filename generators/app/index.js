var generators = require('yeoman-generator')

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
    var done = this.async()

    this.prompt({
      type: 'list',
      name: 'type',
      message: 'Choose your project type',
      choices: [
        { name: 'Library for common module', value: 'lib' }
      ]
    }, answer => {
      this.props.type = answer.type
      done()
    })
  },

  default: function () {
    var map = {
      lib: '../lib'
    }
    var ns = 'butler:' + this.props.type
    var local = map[this.props.type]

    if (ns) {
      this.composeWith(ns, {
        options: this.options
      }, {
        local: require.resolve(local)
      })
    }
  },

  install: function () {
    this.npmInstall()
  }
})
