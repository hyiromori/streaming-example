const { v4: uuid } = require('uuid')
const AWS = require('aws-sdk')
const { logger } = require('../lib/logger')

const S3 = new AWS.S3({ apiVersion: '2006-03-01' })
const Bucket = process.env.UPLOAD_BUCKET

module.exports.handler = async (event) => {
  try {
    const id = uuid()
    const path = `source/${id}`
    const contentType = event.queryStringParameters['content-type']

    const params = {
      Bucket,
      Key: path,
      ContentType: contentType,
      Expires: 3600, // 1 Hour
    }
    const result = await S3.getSignedUrlPromise('putObject', params)

    return {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadId: id,
        uploadUrl: result,
      }, null, 2),
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
