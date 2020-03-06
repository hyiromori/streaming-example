const { v4: uuid } = require('uuid')
const { logger } = require('../lib/logger')

module.exports.handler = async (event) => {
  try {
    logger.info(event)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        uuid: uuid(),
      }, null, 2),
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: e.message,
      }, null, 2),
    }
  }
}
