const { logger } = require('../lib/logger')
const { getVideoInfo, putVideoInfo } = require('../lib/dynamodb')
const { createJob } = require('../lib/mediaconvert')

module.exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters
    const videoInfo = await getVideoInfo(id)

    // const url = `https://${CloudFrontDomain}/${videoId}/hls1/video.m3u8`

    if (videoInfo.jobId != null) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, jobId: videoInfo.jobId }, null, 2),
      }
    }

    const job = await createJob(id)
    const { Id: jobId } = job.Job
    await putVideoInfo(id, { ...videoInfo, jobId, finished: false })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, jobId }, null, 2),
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
