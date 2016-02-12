var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  writing: function () {
    this.fs.copy(
      this.templatePath('.gitattributes'),
      this.destinationPath('.gitattributes')
    )

    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    )
  },

  end: function () {
    // init git repo maybe?
  }
})
