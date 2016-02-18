// 这里应该放一些环境的配置，比如端口号或者静态资源发布之类的
// 没有直接用json，因为考虑到一些配置可能需要一些逻辑计算才能得到
//
// 建议：在这里配置是环境变量中的某个值或者提供一个测试用的默认值，比如：
//
//   {
//     port: process.env['SITE_PORT'] || 3000
//   }

const fp = require('path')
const __IS_PROD__ = process.env['NODE_ENV'] === 'production'

module.exports = {
  __IS_PROD__,
  port: 3000,
  <% if (isWebhost) { %>
    // 开发目录
  entry: fp.join(__dirname, '../src/index.js'),
  srcPath: fp.join(__dirname, '../src'),
  assets: fp.join(__dirname, '../assets'),
  publicPath: fp.join(__dirname, '../../www'),
  entriesDirectory: fp.join(__dirname, '../server/views'),
  locals: {
    title: "页面标题"
  }
  <% } %>
}
