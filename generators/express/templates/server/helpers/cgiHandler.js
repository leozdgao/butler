// 定义一个cgi的处理约定，以文件夹名字作为匹配基准，比如有如下目录结构：
//
// - router
//   - home
//   - info
//   - about
//
// 那么最终的handler就会匹配'/'、'/info'和'/about'
const Router = require('express').Router
const fsp = require('fs-promise')
const fp = require('path')
const _ = require('lodash')
const walkSync = require('walk').walkSync
const chalk = require('chalk')

const cgiWarning = msg => console.warn(chalk.yellow(`[CGI warning] ${msg}`))

function cgiHandler (options) {
  const cgiIndex = options.index || 'home'
  const routerPath = options.routerPath
  // const {
  //   index: cgiIndex = 'home', // 用来处理匹配路径'/'
  //   routerPath
  // } = options

  // fs模块中的exists方法目前已经是`Deprecated`状态
  // #DONE:30 查看fs模块中exists方法的替换方式 +node
  const checkExist = path => fsp.existsSync.bind(fsp, path)
    // return fsp.accessSync ?
      // fsp.accessSync.bind(fsp, path, fsp.F_OK) : // fsp中并并没有F_OK等常量
  const checkRouterPathExist = checkExist(routerPath)

  if (!checkRouterPathExist()) {
    throw new Error('The option "routerPath" should be an existed path to handle requests.')
  }

  const router = Router()
  const walkerOption = {
    followLinks: false,
    listeners: {
      directories (root, stats) {
        stats.forEach(stat => {
          const name = stat.name
          const routerHandlerPath = fp.join(routerPath, name, 'index.js')
          const checkRouterHandler = checkExist(routerHandlerPath)
          if (checkRouterHandler()) {
            // 动态加载router，并添加cgi配置
            try {
              const handler = require(routerHandlerPath)

              if (_.isFunction(handler)) {
                const mountP = (name === cgiIndex) ? '/' : `/${name}`
                router.use(mountP, handler)
              }
              else { // 添加一些错误提示
                cgiWarning(`Find a handler of [${name}] but it is not a function, so it will not be added to cgi config.`)
              }
            }
            catch (e) {
              cgiWarning(`Failed to add handler for [${name}], msg: ${e.message}.`)
            }
          }
        })
      }
    }
  }

  // 开始遍历router目录
  walkSync(routerPath, walkerOption)

  return router
}

module.exports = cgiHandler
