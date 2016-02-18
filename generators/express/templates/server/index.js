'use strict'

const express = require('express')
const fp = require('path')
const env = require('../config/environment')
const cgiHandler = require('./helpers/cgiHandler')
const __IS_PROD__ = env.__IS_PROD__

const app = express()

<% if (isWebhost) { %>
const _ = require('lodash')
const serve = require('serve-static')
const request = require('superagent')
const hbs = require('./helpers/hbsEngine')
// #DONE:10 配置模板引擎 +server
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', env.entriesDirectory)

_.assign(app.locals, env.locals)

appendAssets(app)
  .then(parseManifest)
  .then(manifest => {
    app.use(makeRouterHandler(manifest))
    appendErrorHandler(app)

    app.emit('assets:ready')
  })
  .catch(err => {
    console.log(err.message)
  })

// 开发模式下，添加webpack的hmr中间件
if (!__IS_PROD__) {
  app.use('/assets', serve(env.assets))
}

function parseManifest (manifest) {
  return new Promise((resolve, reject) => {
    if (!__IS_PROD__) resolve(manifest)
    else {
      const css = manifest.css[0] // 只有一份 css 文件
      const requestUrl = css.content
      request.get(requestUrl).end((err, cres) => {
        const content = cres && cres.text
        manifest.css[0] = {
          type: 'style',
          content
        }
        resolve(manifest)
      })
    }
  })
}

function makeRouterHandler (manifest) {
  return cgiHandler({
    index: 'home',
    routerPath: fp.join(__dirname, './routers')
  })
}

function appendErrorHandler (app) {
  app.use((req, res, next) => {
    const err = Error('Not found')
    err.status = 404
    next(err)
  })
  app.use((err, req, res, next) => {
    res.render('error', {
      layout: false,
      err
    })
  })
}

function appendAssets (app) {
  return new Promise((resolve, reject) => {
    if (__IS_PROD__) {
      var manifest

      try {
        request.get(url.resolve(env.resourceBase, 'assets-client.json')).end((err, cres) => {
          manifest = cres.body.main

          var css = manifest.css
          if (!Array.isArray(css)) {
            css = [ css ]
          }
          manifest.css = css.map(v => ({ type: 'link', content: url.resolve(env.resourceBase, v) }))

          var js = manifest.js
          if (!Array.isArray(js)) {
            js = [ js ]
          }
          manifest.js = js.map(v => ({ type: 'scriptsrc', content: url.resolve(env.resourceBase, v) }))

          resolve(manifest)
          // app.locals.assets = manifest
        })
      }
      catch (e) {
        console.log('Can\'t parse assets metadata.')
        process.exit(1)
      }
    }
    else {
      const webpack = require('webpack')
      const config = require('../config/webpack/webpack.dev.js')
      const compiler = webpack(config)

      app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      }))

      <% if (needWebpack) { %>
      app.use(require('webpack-hot-middleware')(compiler))
      <% } %>

      resolve({
        js: [ { content: '/static/bundle.js', type: 'scriptsrc' } ],
        css: [ ]
      })
    }
  })
}
<% } else { %>
app.use(cgiHandler({
  index: 'home',
  routerPath: fp.join(__dirname, './routers')
}))

app.use((req, res, next) => {
  const err = Error('Not found')
  err.status = 404
  next(err)
})
app.use((err, req, res, next) => {
  res.status(200).json({ msg: err.message })
})
<% } %>

module.exports = app
