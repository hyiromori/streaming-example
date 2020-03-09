const { logger } = require('../lib/logger')

module.exports.handler = async (event) => {
  const videoId = event.pathParameters.id
  logger.info(videoId)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}, null, 2),
  }
}
