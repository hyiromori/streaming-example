const AWS = require('aws-sdk')

const Bucket = process.env.S3_BUCKET
const UploadPrefix = process.env.S3_UPLOAD_PREFIX
const MediaConvertEndpoint = process.env.MEDIACONVERT_ENDPOINT

const MediaConvert = new AWS.MediaConvert({ apiVersion: '2017-08-29', endpoint: MediaConvertEndpoint })

const createJob = (videoId) => {
  const s3SourcePath = `s3://${Bucket}/${UploadPrefix}/${videoId}`
  const s3DestPath = `s3://${Bucket}/${videoId}`
  const params = {
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
  }
  return MediaConvert.createJob(params).promise()
}

const getJob = (jobId) => MediaConvert.getJob({ Id: jobId }).promise()

module.exports = {
  createJob,
  getJob,
}
