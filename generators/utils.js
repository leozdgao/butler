var path = require('path')
var fs = require('fs')
var extend = require('deep-extend')

module.exports = {
  copyTpl, copy, writeDependencies,
  readPackageJSON, writePackageJSON, extendPackageJSON
}

function copyTpl (generator, file, options) {
  generator.fs.copyTpl(
    generator.templatePath(file),
    generator.destinationPath(file),
    options
  )
}

function copy (generator, file) {
  if (file) paste(file)
  else recursive(generator, '.', paste)

  function paste (file) {
    generator.fs.copy(
      generator.templatePath(file),
      generator.destinationPath(file)
    )
  }
}

function writeDependencies (generator, deps, devDeps) {
  extendPackageJSON(generator, {
    dependencies: deps,
    devDependencies: devDeps
  })
}

function extendPackageJSON (generator, others) {
  var pkg = readPackageJSON(generator)

  extend(pkg, others)

  writePackageJSON(generator, pkg)
}

function readPackageJSON (generator) {
  var pkgFile = generator.destinationPath('package.json')
  return generator.fs.readJSON(pkgFile) || { }
}

function writePackageJSON (generator, pkg) {
  var pkgFile = generator.destinationPath('package.json')
  generator.fs.writeJSON(pkgFile, pkg)
}

function recursive (generator, sub, cb) {
  var base = generator.templatePath()
  var pwd = path.join(base, sub)
  var files = fs.readdirSync(pwd)

  files.forEach(function (file) {
    var stat = fs.statSync(path.resolve(pwd, file))
    var p = path.join(sub, file)
    if (stat.isDirectory()) recursive(generator, p, cb)
    if (stat.isFile()) cb(p)
  })
}