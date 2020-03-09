const AWS = require('aws-sdk')
const { logger } = require('../lib/logger')
const { getVideoInfo, putVideoInfo } = require('../lib/dynamodb')
const { getConvertInfo } = require('../lib/mediaconvert')

const Bucket = process.env.S3_BUCKET
const UploadPrefix = process.env.S3_UPLOAD_PREFIX
const MediaConvertEndpoint = process.env.MEDIACONVERT_ENDPOINT
const CloudFrontDomain = process.env.CLOUDFRONT_DOMAIN

const MediaConvert = new AWS.MediaConvert({
  apiVersion: '2017-08-29',
  endpoint: MediaConvertEndpoint,
})

const getParams = (s3SourcePath, s3DestPath) => ({
  Role: 'arn:aws:iam::644989259572:role/MediaConvertRole',
  Settings: {
    Inputs: [
      {
        FileInput: s3SourcePath,
      },
    ],
    OutputGroups: [
      {
        OutputGroupSettings: {
          HlsGroupSettings: {
            Destination: `${s3DestPath}/hls1/video`,
          },
        },
      },
      {
        OutputGroupSettings: {
          FileGroupSettings: {
            Destination: `${s3DestPath}/thumbnail/image`,
          },
        },
      },
    ],
  },
  JobTemplate: 'HLS_Template',
})

module.exports.handler = async (event) => {
  try {
    const videoId = event.pathParameters.id
    const videoInfo = await getVideoInfo(videoId)

    const params = getParams(`s3://${Bucket}/${UploadPrefix}/${videoId}`, `s3://${Bucket}/${videoId}`)
    const url = `https://${CloudFrontDomain}/${videoId}/hls1/video.m3u8`

    if (videoInfo.jobId != null) {
      const job = await getConvertInfo(videoInfo.jobId)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, job }, null, 2),
      }
    }

    const job = await MediaConvert.createJob(params).promise()
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
