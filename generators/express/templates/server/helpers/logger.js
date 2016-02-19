const winston = require('winston')
const fp = require('path')
const mkdirp = require('mkdirp')
const env = require('../../config/environment')

const transports = []

function ensure (path) {
  mkdirp.sync(fp.dirname(path))
}

if (env.__IS_PROD__ && env.log) {
  // if (env.log.info) {
  ensure(env.log)
  transports.push(
    new winston.transports.File({
      name: 'info-file',
      filename: env.log.info
      // level: 'info'
    })
  )
}
else {
  transports.push(new winston.transports.Console())
}

const logger = new winston.Logger({
  transports
})
logger.filters.push((level, msg, meta) => {
  return `${new Date()} ${msg}`
})

module.exports = logger
