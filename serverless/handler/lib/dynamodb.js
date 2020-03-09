const AWS = require('aws-sdk')

const DocumentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
const TableName = process.env.DYNAMODB_TABLE

const getVideoInfo = async (id) => {
  const getParams = { TableName, Key: { id } }
  const data = await DocumentClient.get(getParams).promise()
  return data.Item
}

const putVideoInfo = async (id, params) => {
  const putParams = { TableName, Item: { ...params, id } }
  await DocumentClient.put(putParams).promise()
}

module.exports = {
  getVideoInfo,
  putVideoInfo,
}
