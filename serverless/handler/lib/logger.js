const log4js = require('log4js')

const logger = log4js.getLogger()
log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'basic'
      }
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'info'
    }
  }
})

module.exports = { logger }
