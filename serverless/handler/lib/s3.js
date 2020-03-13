const AWS = require('aws-sdk')

const Bucket = process.env.S3_BUCKET

const S3 = new AWS.S3({ apiVersion: '2006-03-01' })

const getKeys = async (prefix) => {
  const { Contents } = await S3.listObjects({ Bucket, Prefix: prefix }).promise()
  return Contents.map(content => content.Key)
}

module.exports = {
  getKeys,
}
