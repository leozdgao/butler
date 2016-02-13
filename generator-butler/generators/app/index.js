var generators = require('yeoman-generator')
var parseAuthor = require('parse-author')
var askName = require('inquirer-npm-name')
var _ = require('lodash')
var utils = require('../utils')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)

    // this.argument('appname', { type: String });
    // this.argument('cc', { type: String });

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
  },

  initializing: function () {
    // this.log(this.appname)
    // this.log(this.cc)
    // this.log(typeof this.options.name)

    // 如果目录下已经存在 package.json，之后就不再出现 prompt 提问
    var pkg = utils.readPackageJSON(this)
    var name = pkg.name || this.options.name // 项目名字

    // 先记录下已存在的信息
    this.props = {
      name: _.kebabCase(name), // 保证是合法的 package 名称
      description: pkg.description,
      version: pkg.version,
      homepage: pkg.homepage,
      keywords: pkg.keywords,
      license: pkg.license
    }

    if (_.isObject(pkg.author)) {
      this.props.authorName = pkg.author.name
      this.props.authorEmail = pkg.author.email
      this.props.authorUrl = pkg.author.url
    }
    else if (_.isString(pkg.author)) {
      var info = parseAuthor(pkg.author)
      this.props.authorName = info.name
      this.props.authorEmail = info.email
      this.props.authorUrl = info.url
    }
  },

  prompting: {
    askForProjectName: function () {
      if (this.props.name) return

      var done = this.async()
      askName({
        name: 'name',
        message: 'You project name',
      }, this, function (name) {
        this.props.name = name
        done()
      }.bind(this))
    },
    askForProps: function () {
      var done = this.async()

      var prompts = [{
        name: 'description',
        message: 'Description',
        when: !this.props.description
      }, {
        name: 'homepage',
        message: 'Project homepage url',
        when: !this.props.homepage
      }, {
        name: 'authorName',
        message: 'Author\'s Name',
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true
      }, {
        name: 'authorEmail',
        message: 'Author\'s Email',
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true
      }, {
        name: 'authorUrl',
        message: 'Author\'s Homepage',
        when: !this.props.authorUrl,
        store: true
      }, {
        name: 'keywords',
        message: 'Package keywords (comma to split)',
        when: !this.props.keywords || this.props.keywords.length <= 0,
        filter: function (words) {
          return words.split(/\s*,\s*/g)
        }
      }]

      this.prompt(prompts, function (props) {
        this.props = _.merge(this.props, props)
        done()
      }.bind(this))
    },
    askForInstallation () {
      var done = this.async()

      this.prompt({
        type: 'confirm',
        name: 'installAfterPrompt',
        message: 'run `npm install` after prompting?',
        default: true
      }, function (answer) {
        this.props.installAfterPrompt = answer.installAfterPrompt
        done()
      }.bind(this))
    }
  },

  default: function () {
    // execute other sub-generators
    this.composeWith('butler:git', { }, {
      local: require.resolve('../git')
    })
    this.composeWith('butler:eslint', {
      options: { babel: this.options.babel, react: this.options.react }
    }, {
      local: require.resolve('../eslint')
    })
    if (this.options.babel) {
      this.composeWith('butler:babel', {
        options: { react: this.options.react }
      }, {
        local: require.resolve('../babel')
      })
    }
    // select a License
    if (!this.props.license) {
      this.composeWith('license', {
        options: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          website: this.props.authorUrl
        }
      }, {
        local: require.resolve('generator-license/app')
      })
    }
  },

  writing: function () {
    // write package.json here
    var pkg = utils.readPackageJSON(this)
    pkg = _.merge(pkg, {
      name: this.props.name,
      version: '0.1.0', // version number for a new project
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      keywords: _.compact(_.uniq(this.props.keywords.concat(pkg.keywords)))
    })

    utils.writePackageJSON(this, pkg)
  },

  install: function () {
    if (this.props.installAfterPrompt) this.npmInstall()
  }
})
