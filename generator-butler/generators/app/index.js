'use strict';
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

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

  prompting: {
    askForProjectName: function () {

    },
    askForProps: function () {

    }
  },

  default: function () {
    // execute other sub-generators
    this.composeWith('butler:git', {}, {
      local: require.resolve('../git')
    })
    this.composeWith('butler:eslint', { babel: this.options.babel, react: this.options.react }, {
      local: require.resolve('../eslint')
    })
    if (this.options.babel) {
      this.composeWith('butler:babel', { react: this.options.react }, {
        local: require.resolve('../babel')
      })
    }
  },

  writing: function () {
    // write package.json here
  },

  install: function () {
    // this.npmInstall()
  }
});
