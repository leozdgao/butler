var path = require('path')
var fs = require('fs')
var extend = require('deep-extend')
var _ = require('lodash')

module.exports = {
  copyTpl, copy, writeDependencies,
  readPackageJSON, writePackageJSON, extendPackageJSON
}

function copyTpl (generator, file, options) {
  if (_.isString(file) && options) pasteTpl(file, options)
  else if (_.isFunction(file) && options) {
    // file as filter
    recursive(generator, '.', file => pasteTpl(file, options), file)
  }
  else {
    options = file
    recursive(generator, '.', file => pasteTpl(file, options), _.constant(true))
  }

  function pasteTpl (file, options) {
    generator.fs.copyTpl(
      generator.templatePath(file),
      generator.destinationPath(file),
      options
    )
  }
}

function copy (generator, file) {
  if (_.isString(file)) paste(file)
  else {
    var filter
    if (_.isFunction(file)) filter = file
    else filter = _.constant(true)

    recursive(generator, '.', paste, filter)
  }

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

function recursive (generator, sub, cb, filter) {
  var base = generator.templatePath()
  var pwd = path.join(base, sub)
  var files = fs.readdirSync(pwd)

  files.forEach(function (file) {
    var stat = fs.statSync(path.resolve(pwd, file))
    var p = path.join(sub, file)
    if (filter(p, stat)) {
      if (stat.isDirectory()) recursive(generator, p, cb, filter)
      if (stat.isFile()) cb(p)
    }
  })
}
