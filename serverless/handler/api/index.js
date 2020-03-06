const { getFileContentText } = require('../lib/static_files')

module.exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/html' },
  body: getFileContentText('index.html'),
})
