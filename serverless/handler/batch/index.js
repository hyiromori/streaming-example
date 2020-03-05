const { logger } = require('../lib/logger')

module.exports.handler = async (event, context) => {
  logger.info(event)
  logger.info(context)
}
