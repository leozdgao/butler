var generators = require('yeoman-generator')
var utils = require('../utils')

module.exports = generators.Base.extend({
  writing: function () {
    utils.copy(this)
  }
})
