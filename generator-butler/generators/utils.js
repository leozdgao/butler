var path = require('path')
var fs = require('fs')
var extend = require('deep-extend')

module.exports = {
  copyTpl: function (generator, file, options) {
    generator.fs.copyTpl(
      generator.templatePath(file),
      generator.destinationPath(file),
      options
    )
  },
  copy: function (generator, file) {
    if (file) paste(file)
    else recursive(generator, '.', paste)

    function paste (file) {
      generator.fs.copy(
        generator.templatePath(file),
        generator.destinationPath(file)
      )
    }
  },
  writeDependencies: function (generator, deps, devDeps) {
    var pkgFile = generator.destinationPath('package.json')
    var pkg = generator.fs.readJSON(pkgFile) || { }

    extend(pkg, {
      dependencies: deps,
      devDependencies: devDeps
    })

    generator.fs.writeJSON(pkgFile, pkg)
  }
}

function recursive (generator, sub, cb) {
  var base = generator.templatePath()
  var pwd = path.join(base, sub)
  var files = fs.readdirSync(pwd)

  files.forEach(function (file) {
    var stat = fs.statSync(path.resolve(pwd, file))
    var p = path.join(sub, file)
    if (stat.isDirectory()) recursive(p)
    if (stat.isFile()) cb(p)
  })
}
