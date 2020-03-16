const path = require('path')
const AWS = require('aws-sdk')

const MediaConvert = new AWS.MediaConvert({
  apiVersion: '2017-08-29',
  endpoint: 'https://mpazqbhuc.mediaconvert.ap-northeast-1.amazonaws.com',
})

const templateName = 'HLS'
const Config = {
  templateName,
  templatePath: path.resolve(__dirname, '../template', `${templateName}.json`),
}

module.exports = { MediaConvert, Config }
