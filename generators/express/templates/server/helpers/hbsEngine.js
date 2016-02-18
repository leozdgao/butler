const exphbs = require('express-handlebars')
const fp = require('path')
const url = require('url')
const UglifyJS = require("uglify-js")
const env = require('../../config/environment')

module.exports = exphbs.create({
  extname: '.hbs',
  layoutsDir: fp.join(env.entriesDirectory, '_layouts'),
  partialsDir: fp.join(env.entriesDirectory, '_partials'),
  defaultLayout: 'master',
  helpers: {
    imageAssets (name) {
      const base = env.imageBase
      return url.resolve(base, name)
    },
    manifest (obj) {
      const type = obj.type
      const content = obj.content

      switch (type) {
      case 'link': return `<link ref="stylesheet" href=${content}>`
      case 'style': return `<style>${content}</style>`
      case 'script': return `<script>${content}</script>`
      case 'scriptsrc':
      default: return `<script src="${content}"></script>`
      }
    },
    embInlineScript: (function () {
      const cache = []
      return lib => {
        try {
          const filePath = require.resolve(lib)
          // 任何内联脚本都需要被压缩
          if (!cache[filePath]) cache[filePath] = UglifyJS.minify(filePath).code

          return `<script>${cache[filePath]}</script>`
        }
        catch (e) { }
      }
    })()
  }
})
