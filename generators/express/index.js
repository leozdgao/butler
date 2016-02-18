var generators = require('yeoman-generator')
var fp = require('path')
var extend = require('lodash').merge
var utils = require('../utils')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    this.option('babel', {
      type: Boolean,
      desc: 'use babel as a transpiler.',
      defaults: true
    })

    this.option('webpack', {
      type: Boolean,
      desc: 'whether include the webpack hmr middleware.',
      defaults: false
    })
    this.props = {
      type: null,
      webpack: this.options.webpack
    }
  },
  prompting: function () {
    var done = this.async()

    if (this.props.webpack) {
      this.props.type = 'web'
    }
    else {
      this.prompt({
        type: 'list',
        name: 'type',
        message: 'What kind of express app?',
        choices: [
          { name: 'Service', value: 'service' },
          { name: 'Web host', value: 'web' }
        ]
      }, answer => {
        var type = answer.type
        this.props.type = type

        if (type === 'web') {
          this.prompt({
            type: 'confirm',
            name: 'webpack',
            message: 'need to include webpack hmr middleware?',
            defaults: true
          }, answer => {
            this.props.webpack = answer.webpack
            done()
          })
        }
        else {
          done()
        }
      })
    }
  },

  default: function () {
    // execute other sub-generators
    this.composeWith('butler:npm', { name: this.options.name }, {
      local: require.resolve('../npm')
    })
    this.composeWith('butler:git', { }, {
      local: require.resolve('../git')
    })
    this.composeWith('butler:eslint', {
      options: { babel: this.options.babel, react: this.options.react }
    }, {
      local: require.resolve('../eslint')
    })
    if (this.props.type === 'web') {
      if (this.options.babel) {
        this.composeWith('butler:babel', {
          options: { react: this.options.react }
        }, {
          local: require.resolve('../babel')
        })
      }
      this.composeWith('butler:webpack', {
        options: {
          hot: this.props.webpack
        }
      }, {
        local: require.resolve('../webpack')
      })
    }
  },

  writing: function () {
    var isWebhost = this.props.type === 'web'
    var needWebpack = this.props.webpack
    var deps = {
      express: '^4.13.4',
      'express-handlebars': '^3.0.0',
      'body-parser': '^1.15.0',
      'cookie-parser': '^1.4.1',
      'serve-static': '^1.10.2',
      'json-server': '^0.8.8',
      'fs-promise': '^0.4.1',
      walk: '^2.3.9',
      chalk: '^1.1.1',
      lodash: '^4.5.0',
      "superagent": "^1.7.2",
      "uglify-js": "^2.6.1"
    }
    var devDeps = {
      debug: '^2.2.0',
      "webpack-dev-middleware": "^1.4.0"
    }

    if (this.props.webpack) {
      devDeps = extend(devDeps, {
        "webpack-hot-middleware": "^2.6.0"
      })
    }

    utils.writeDependencies(this, deps, devDeps)

    utils.copyTpl(this, (p, stat) => {
      if (!isWebhost) {
        if (fp.basename(p) === 'views' && stat.isDirectory()) return false
        if (fp.basename(p) === 'hbsEngine.js') return false
        if (fp.basename(p) === 'src' && stat.isDirectory()) return false
      }

      return true
    }, {
      isWebhost, needWebpack
    })

    utils.extendPackageJSON(this, {
      scripts: {
        start: "node ./bin/www"
      }
    })
  }
})
