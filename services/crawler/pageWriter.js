const path = require("path")
const fs = require("fs")
const crypto = require('crypto')
const { PAGE_DOCUMENTS_DIR } = require('../config/constants.js')

const PageWriter = function()  {
  function hashLocation(parsedCsvRow) {
    const md5 = crypto.createHash('md5').update(parsedCsvRow.Domain).digest('hex')
    const one = md5.slice(0, 2)
    const two = md5.slice(2,2);

    return {
      md5, one, two, dir: path.join(PAGE_DOCUMENTS_DIR, one, two), path: path.join(PAGE_DOCUMENTS_DIR, one, two, md5)
    }
  }

  function pageExists(path) {
    return fs.existsSync(path)
  }


  function write(parsedCsvRow, content, cb) {
    const pageLocation = hashLocation(parsedCsvRow);

    fs.mkdir(pageLocation.dir, { recursive: true }, function(err, fd) {
      if(err) return cb(err)

      fs.writeFile(pageLocation.path, content, function(err) {
        if(err) return cb(err);

        cb()
      })
    })
  }

  return { write, pageExists, hashLocation }
}

module.exports = PageWriter()
