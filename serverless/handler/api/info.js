const { logger } = require('../lib/logger')
const { getVideoInfo } = require('../lib/dynamodb')
const { getConvertInfo } = require('../lib/mediaconvert')

const CloudFrontDomain = process.env.CLOUDFRONT_DOMAIN

module.exports.handler = async (event) => {
  const videoId = event.pathParameters.id
  const videoInfo = await getVideoInfo(videoId)
  logger.info(videoInfo)

  const job = await getConvertInfo(videoInfo.jobId)
  const url = `https://${CloudFrontDomain}/${videoId}/hls1/video.m3u8`

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, job }, null, 2),
  }
}
