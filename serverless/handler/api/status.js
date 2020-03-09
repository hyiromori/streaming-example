const { logger } = require('../lib/logger')
const { getVideoInfo } = require('../lib/dynamodb')
const { getConvertInfo } = require('../lib/mediaconvert')

module.exports.handler = async (event) => {
  const videoId = event.pathParameters.id
  const videoInfo = await getVideoInfo(videoId)
  logger.info(videoInfo)
  const job = await getConvertInfo(videoInfo.jobId)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...videoInfo, job }, null, 2),
  }
}
