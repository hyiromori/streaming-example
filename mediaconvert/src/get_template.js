const { MediaConvert, Config } = require('./common')
const fs = require('fs')

const main = async () => {
  try {
    const template = await MediaConvert.getJobTemplate({ Name: Config.templateName }).promise()
    fs.writeFileSync(Config.templatePath, JSON.stringify(template, null, 2))
  } catch (_) {
    console.log('Template not found:', Config.templateName)
  }
}

main()
