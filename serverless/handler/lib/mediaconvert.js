const AWS = require('aws-sdk')

const MediaConvertEndpoint = process.env.MEDIACONVERT_ENDPOINT
const MediaConvert = new AWS.MediaConvert({ apiVersion: '2017-08-29', endpoint: MediaConvertEndpoint })

const getConvertInfo = async (jobId) => {
  const job = await MediaConvert.getJob({ Id: jobId }).promise()
  return job
}

module.exports = {
  getConvertInfo,
}
