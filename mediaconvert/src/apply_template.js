const { MediaConvert, Config } = require('./common')
const fs = require('fs')

const main = async () => {
  try {
    const { JobTemplate } = JSON.parse(fs.readFileSync(Config.templatePath))
    delete JobTemplate.Arn
    delete JobTemplate.CreatedAt
    delete JobTemplate.LastUpdated
    delete JobTemplate.Type
    const params = { ...JobTemplate, Name: Config.templateName }

    let exists = false
    try {
      await MediaConvert.getJobTemplate({ Name: Config.templateName }).promise()
      exists = true
    } catch (_) {
      // Do nothing
    }

    if (exists) {
      console.log('Update template:', Config.templateName)
      await MediaConvert.updateJobTemplate(params).promise()
    } else {
      console.log('Create template:', Config.templateName)
      await MediaConvert.createJobTemplate(params).promise()
    }
  } catch (err) {
    console.error(err)
  }
}

main()
