const fs = require('fs')
const path = require('path')

const BASE = path.resolve(__dirname, '..', '..', 'static_files')

const getFileContentText = (relativePath) => {
  const absolutePath = path.resolve(BASE, relativePath)
  return fs.readFileSync(absolutePath).toString('utf8')
}

module.exports = { getFileContentText }
