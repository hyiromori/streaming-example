const AWS = require('aws-sdk')
const { logger } = require('../lib/logger')

const MediaConvert = new AWS.MediaConvert({
  apiVersion: '2017-08-29',
  endpoint: 'https://mpazqbhuc.mediaconvert.ap-northeast-1.amazonaws.com',
})
const Bucket = process.env.DELIVERY_BUCKET

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
            Destination: `${s3DestPath}/hls`,
          },
        },
      },
    ],
  },
  JobTemplate: 'HLS_Template',
})

module.exports.handler = async (event) => {
  try {
    const { s3Path, uploadId } = JSON.parse(event.body)
    const params = getParams(s3Path, `s3://${Bucket}/${uploadId}`)
    const job = await MediaConvert.createJob(params).promise()
    const url = `https://d1wfkbka4um3up.cloudfront.net/${uploadId}/hls.m3u8`

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        url,
        job,
      }, null, 2),
    }
  } catch (e) {
    logger.error(e)
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
