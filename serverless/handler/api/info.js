const { logger } = require('../lib/logger')
const { getVideoInfo, putVideoInfo } = require('../lib/dynamodb')
const { getJob } = require('../lib/mediaconvert')
const { getKeys } = require('../lib/s3')

const CloudFrontDomain = process.env.CLOUDFRONT_DOMAIN

module.exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters
    logger.info(id)
    let videoInfo = await getVideoInfo(id)
    const { finished, jobId } = videoInfo

    const { Job: job } = await getJob(jobId)
    const { Status } = job

    if (!finished && (Status === 'COMPLETE' || Status === 'ERROR')) {
      const videos = [{ mediaType: 'HLS', url: `https://${CloudFrontDomain}/${id}/hls1/video.m3u8` }]
      const thumbnailKeys = await getKeys(`${id}/thumbnail/`)
      const thumbnails = thumbnailKeys.map(key => `https://${CloudFrontDomain}/${key}`)
      videoInfo = { ...videoInfo, finished: true, videos, thumbnails }
      await putVideoInfo(id, videoInfo)
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...videoInfo, job }, null, 2),
    }
  } catch (err) {
    logger.error(err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: err.message,
      }, null, 2),
    }
  }
}
