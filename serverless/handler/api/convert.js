const { logger } = require('../lib/logger')
const { getVideoInfo, putVideoInfo } = require('../lib/dynamodb')
const { createJob, getJob } = require('../lib/mediaconvert')

const CloudFrontDomain = process.env.CLOUDFRONT_DOMAIN

module.exports.handler = async (event) => {
  try {
    const videoId = event.pathParameters.id
    const videoInfo = await getVideoInfo(videoId)

    const url = `https://${CloudFrontDomain}/${videoId}/hls1/video.m3u8`

    if (videoInfo.jobId != null) {
      const job = await getJob(videoInfo.jobId)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, job }, null, 2),
      }
    }

    const job = await createJob(videoId)
    await putVideoInfo(videoId, { ...videoInfo, jobId: job.Job.Id })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, job }, null, 2),
    }
  } catch (e) {
    logger.error(e)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }, null, 2),
    }
  }
}
